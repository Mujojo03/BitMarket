import os
from datetime import datetime
from models.db import db
from models.wallet import Wallet
from models.payment import Payment
from models.transaction import Transaction
from lightning.lnd_client import LNDClient

# Initialize LND client
lnd = LNDClient(
    os.getenv("LND_HOST"),
    macaroon_filepath=os.getenv("LND_MACAROON_PATH"),
    cert_filepath=os.getenv("LND_CERT_PATH")
)

def create_invoice(amount, memo="Invoice", order_id=None, provider="lnd"):
    """
    Create an invoice using LND and store it in the database as a Payment record.
    """
    invoice = lnd.add_invoice(value=amount, memo=memo)

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

    return {
        "payment_request": invoice.payment_request,
        "payment_id": payment.id,
        "payment_hash": invoice.r_hash.hex()
    }

def mark_payment_settled(payment_hash: str, socketio):
    """
    Update the payment and user's wallet when an invoice settles,
    then emit a SocketIO event to notify the frontend.

    Args:
        payment_hash (str): Hex string of the payment hash.
        socketio (SocketIO): SocketIO instance to emit events.
    """
    payment = Payment.query.filter_by(payment_hash=payment_hash).first()
    if not payment:
        print(f"[mark_payment_settled] Payment not found for hash: {payment_hash}")
        return None

    # Update payment status and settled timestamp
    payment.status = 'settled'
    payment.settled_at = datetime.utcnow()
    db.session.add(payment)

    # Create a transaction record for this settlement
    txn = Transaction(
        payment_id=payment.id,
        event_type='payment-settled',
        transaction_metadata=f"Payment settled on {datetime.utcnow().isoformat()}"
    )
    db.session.add(txn)

    # Find the user's wallet (assuming Payment has user_id or via order)
    # Adjust this part according to your actual schema
    user_id = None
    if hasattr(payment, "user_id") and payment.user_id:
        user_id = payment.user_id
    elif hasattr(payment, "order") and payment.order and hasattr(payment.order, "user_id"):
        user_id = payment.order.user_id

    wallet = None
    if user_id:
        wallet = Wallet.query.filter_by(user_id=user_id).first()

    if wallet:
        wallet.balance_sats = (wallet.balance_sats or 0) + payment.amount_sats
        db.session.add(wallet)
    else:
        print(f"[mark_payment_settled] Wallet not found for user_id: {user_id}")

    db.session.commit()

    # Emit SocketIO event to notify client(s) about payment update
    if user_id:
        room = f"user_{user_id}"
        socketio.emit('payment_settled', {
            'payment_id': payment.id,
            'payment_hash': payment_hash,
            'status': payment.status,
            'settled_at': payment.settled_at.isoformat(),
            'wallet_balance_sats': wallet.balance_sats if wallet else None
        }, room=room)

        print(f"[mark_payment_settled] Payment {payment.id} marked as settled and wallet updated for user {user_id}.")
    else:
        print(f"[mark_payment_settled] No user_id found to emit socket event for payment {payment.id}.")

    return payment

def invoice_callback(invoice, socketio):
    """
    Callback to handle invoice settlements from LND subscription.

    Args:
        invoice: Invoice object from LND.
        socketio: SocketIO instance to emit events.
    """
    payment_hash = invoice.r_hash.hex()
    payment = Payment.query.filter_by(payment_hash=payment_hash).first()
    if payment:
        # Attempt to get user_id for socket room emission
        user_id = None
        if hasattr(payment, "order") and payment.order and hasattr(payment.order, "user_id"):
            user_id = payment.order.user_id
        elif hasattr(payment, "user_id") and payment.user_id:
            user_id = payment.user_id

        if user_id:
            socketio.emit("invoice_settled", {
                "payment_hash": payment_hash,
                "memo": invoice.memo,
                "amount": invoice.amt_paid_sat,
                "settled": True
            }, room=f"user_{user_id}")

def stream_invoices(callback=None, socketio=None):
    """
    Stream invoices from LND continuously.
    When an invoice settles, update payment status and notify via socketio.

    Args:
        callback (callable, optional): Additional callback to run on invoice settlement.
        socketio (SocketIO, optional): SocketIO instance to emit events.
    """
    for invoice in lnd.subscribe_invoices():
        if invoice.settled:
            payment_hash = invoice.r_hash.hex()
            mark_payment_settled(payment_hash, socketio=socketio)

            if callback:
                callback(invoice, socketio=socketio)


# import os
# from datetime import datetime
# from server.models import db
# from server.models.wallet import Wallet
# from server.models.payment import Payment
# from server.models.transaction import Transaction
# from lightning.lnd_client import LNDClient

# # Initialize LND client
# lnd = LNDClient(
#     os.getenv("LND_HOST"),
#     macaroon_filepath=os.getenv("LND_MACAROON_PATH"),
#     cert_filepath=os.getenv("LND_CERT_PATH")
# )

# def create_invoice(amount, memo="Invoice", order_id=None, provider="lnd"):
#     """Create an invoice using LND and store it in the DB."""
#     invoice = lnd.add_invoice(value=amount, memo=memo)

#     payment = Payment(
#         order_id=order_id,
#         invoice=invoice.payment_request,
#         payment_hash=invoice.r_hash.hex(),
#         amount_sats=amount,
#         provider=provider,
#         status="pending"
#     )
#     db.session.add(payment)
#     db.session.commit()

#     return {
#         "payment_request": invoice.payment_request,
#         "payment_id": payment.id,
#         "payment_hash": invoice.r_hash.hex()
#     }

# def mark_payment_settled(payment_hash: str, socketio):
#     """
#     Called when a Lightning invoice with payment_hash settles.

#     - Update Payment status to 'settled' with timestamp.
#     - Create a Transaction record logging settlement.
#     - Update User's Wallet balance by adding payment amount.
#     - Emit a socketio event to notify frontend clients.
#     """
#     payment = Payment.query.filter_by(payment_hash=payment_hash).first()
#     if not payment:
#         print(f"[mark_payment_settled] Payment not found for hash: {payment_hash}")
#         return None

#     # Update payment status and settled timestamp
#     payment.status = 'settled'
#     payment.settled_at = datetime.utcnow()
#     db.session.add(payment)

#     # Create a transaction record for this settlement
#     txn = Transaction(
#         payment_id=payment.id,
#         event_type='payment-settled',
#         transaction_metadata=f"Payment settled on {datetime.utcnow().isoformat()}"
#     )
#     db.session.add(txn)

#     # Find the user's wallet (assuming payment has user_id or order references user)
#     # Adjust as per your schema. Here, let's say Payment has user_id field.
#     wallet = Wallet.query.filter_by(user_id=payment.user_id).first()
#     if not wallet:
#         print(f"[mark_payment_settled] Wallet not found for user_id: {payment.user_id}")
#         # You can optionally create a wallet here if your logic allows
#         # For now, just skip wallet update
#     else:
#         # Update wallet balance by adding payment amount (in sats)
#         wallet.balance_sats = (wallet.balance_sats or 0) + payment.amount_sats
#         db.session.add(wallet)

#     # Commit all DB changes
#     db.session.commit()

#     # Emit SocketIO event to notify client(s) about payment update
#     # Assuming you namespace rooms by user_id
#     room = f"user_{payment.user_id}"
#     socketio.emit('payment_settled', {
#         'payment_id': payment.id,
#         'payment_hash': payment_hash,
#         'status': payment.status,
#         'settled_at': payment.settled_at.isoformat(),
#         'wallet_balance_sats': wallet.balance_sats if wallet else None
#     }, room=room)

#     print(f"[mark_payment_settled] Payment {payment.id} marked as settled and wallet updated.")
#     return payment



# def stream_invoices(callback, socketio=None):
#     """
#     Continuously stream invoices from LND and trigger callback on settlement.
#     Also pass socketio to mark_payment_settled for emitting events.
#     """
#     for invoice in lnd.subscribe_invoices():
#         if invoice.settled:
#             # Note: invoice.r_hash is bytes, convert to hex string for lookup
#             payment_hash = invoice.r_hash.hex()
#             mark_payment_settled(payment_hash, socketio=socketio)
            
#             if callback:
#                 callback(invoice)



