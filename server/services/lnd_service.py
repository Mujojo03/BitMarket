import os
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

from models.db import db
from models.wallet import Wallet
from models.payment import Payment
from models.transaction import Transaction
from lightning.lnd_client import LNDClient

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)


class LNDService:
    def __init__(self, node=None):
        """
        Initialize the LNDService with the specified node,
        or fallback to environment variable LND_NODE or 'alice'.
        """
        self.node = node or os.getenv("LND_NODE", "alice")
        self.client = self._get_client(self.node)

    def _get_client(self, node):
        """
        Create LNDClient with environment variables per node.
        """
        node = node.lower()
        if node == "alice":
            host = os.getenv("LND_ALICE_HOST")
            macaroon = os.getenv("LND_ALICE_MACAROON_PATH")
            cert = os.getenv("LND_ALICE_CERT_PATH")
        elif node == "bob":
            host = os.getenv("LND_BOB_HOST")
            macaroon = os.getenv("LND_BOB_MACAROON_PATH")
            cert = os.getenv("LND_BOB_CERT_PATH")
        else:
            raise ValueError(f"Unsupported node: {node}")

        if not all([host, macaroon, cert]):
            raise EnvironmentError(f"Missing LND config for node {node}")

        return LNDClient(host, macaroon, cert)

    def create_invoice(self, amount, memo="Invoice", order_id=None, provider="lnd"):
        """
        Create a Lightning invoice using the configured LND node.
        """
        invoice = self.client.add_invoice(value=amount, memo=memo)

        payment = Payment(
            order_id=order_id,
            invoice=invoice.payment_request,
            payment_hash=invoice.r_hash.hex(),
            amount_sats=amount,
            provider=provider,
            status="pending"
        )
        db.session.add(payment)
        db.session.commit()

        # Log transaction event for invoice generated
        txn = Transaction(
            payment_id=payment.id,
            event_type="invoice-generated",
            transaction_metadata=f"Invoice created with memo '{memo}' for amount {amount} sats."
        )
        db.session.add(txn)
        db.session.commit()

        return {
            "payment_request": invoice.payment_request,
            "payment_id": payment.id,
            "payment_hash": invoice.r_hash.hex()
        }

    def pay_invoice(self, payment_request):
        """
        Pay a Lightning invoice using the current LND node.
        """
        response = self.client.send_payment_sync(payment_request=payment_request)

        if response.payment_error:
            raise Exception(response.payment_error)

        return {
            "payment_hash": response.payment_hash.hex(),
            "payment_preimage": response.payment_preimage.hex(),
            "status": "paid"
        }

    def stream_invoices(self, callback=None, socketio=None):
        """
        Subscribe to incoming invoices and handle settlements in real-time.
        """
        for invoice in self.client.subscribe_invoices():
            if invoice.settled:
                payment_hash = invoice.r_hash.hex()
                self.mark_payment_settled(payment_hash, socketio)

                if callback:
                    callback(invoice, socketio=socketio)

    def mark_payment_settled(self, payment_hash: str, socketio):
        """
        Mark a payment as settled in the database and notify via WebSocket.
        """
        payment = Payment.query.filter_by(payment_hash=payment_hash).first()
        if not payment:
            print(f"[mark_payment_settled] Payment not found for hash: {payment_hash}")
            return None

        payment.status = 'settled'
        payment.settled_at = datetime.utcnow()
        db.session.add(payment)

        txn = Transaction(
            payment_id=payment.id,
            event_type='payment-settled',
            transaction_metadata=f"Payment settled on {datetime.utcnow().isoformat()}"
        )
        db.session.add(txn)

        wallet = Wallet.query.first()
        if wallet:
            wallet.balance_sats = (wallet.balance_sats or 0) + payment.amount_sats
            db.session.add(wallet)
        else:
            print(f"[mark_payment_settled] No wallet found to update.")

        db.session.commit()

        socketio.emit('payment_settled', {
            'payment_id': payment.id,
            'payment_hash': payment_hash,
            'status': payment.status,
            'settled_at': payment.settled_at.isoformat(),
            'wallet_balance_sats': wallet.balance_sats if wallet else None
        })
        socketio.emit('invoice_paid', {
            'payment_id': payment.id,
            'order_id': payment.order_id,
            'message': "Payment received. Redirecting to checkout..."
        }, room=f"user_{payment.order.buyer_id}")


        print(f"[mark_payment_settled] Payment {payment.id} marked as settled.")
        return payment

    def invoice_callback(self, invoice, socketio=None):
        from services.cart_service import checkout_complete
        """
        Callback for settled invoices with custom memo handling.
        Emits real-time events for invoice settlement or failure.
        """
        payment_hash = invoice.r_hash.hex()
        memo = invoice.memo or ""
        txn_id = None

        if invoice.settled:
            # Try to extract txn_id if memo contains one
            if "txn" in memo:
                try:
                    txn_id = int(memo.split()[-1])
                    txn = Transaction.query.get(txn_id)
                    if txn and txn.status == 'pending':
                        txn.status = 'completed'
                        # Replace with your custom logic
                        checkout_complete(txn.user_id)
                        db.session.commit()

                        socketio.emit('invoice_paid', {
                            "transaction_id": txn.id,
                            "message": "Payment received. Checkout complete."
                        }, room=f"user_{txn.user_id}")
                except Exception as e:
                    print(f"[invoice_callback] Failed to parse txn_id: {e}")

            # Fallback if not a checkout invoice
            self.mark_payment_settled(payment_hash, socketio)

            socketio.emit("invoice_settled", {
                "payment_hash": payment_hash,
                "memo": memo,
                "amount": invoice.amt_paid_sat,
                "settled": True
            })

        elif invoice.state == "CANCELED" or invoice.state == "EXPIRED":
            user_id = None
            if txn_id:
                txn = Transaction.query.get(txn_id)
                user_id = txn.user_id if txn else None

            socketio.emit('invoice_failed', {
                "transaction_id": txn_id,
                "message": "Invoice expired or canceled."
            }, room=f"user_{user_id}" if user_id else None)