import grpc
import os
from . lightning_stub import lightning_pb2 as ln
from . lightning_stub import lightning_pb2_grpc as lnrpc

class LNDClient:
    def __init__(self, host, macaroon_filepath, cert_filepath):
        # Load TLS cert
        cert = open(cert_filepath, 'rb').read()
        creds = grpc.ssl_channel_credentials(cert)

        # Load macaroon and encode as hex string in metadata
        macaroon_bytes = open(macaroon_filepath, 'rb').read()
        macaroon_hex = macaroon_bytes.hex()

        def metadata_callback(context, callback):
            callback([('macaroon', macaroon_hex)], None)

        auth_creds = grpc.metadata_call_credentials(metadata_callback)
        composite_creds = grpc.composite_channel_credentials(creds, auth_creds)

        self.channel = grpc.secure_channel(host, composite_creds)
        self.stub = lnrpc.LightningStub(self.channel)

    def add_invoice(self, value, memo):
        req = ln.Invoice(value=value, memo=memo)
        return self.stub.AddInvoice(req)

    def subscribe_invoices(self):
        req = ln.InvoiceSubscription()
        return self.stub.SubscribeInvoices(req)
    

# import os
# from datetime import datetime
# from server.models import db
# from server.models.wallet import Wallet
# from server.models.payment import Payment
# from server.models.transaction import Transaction

# # Initialize LND client from env variables
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

# def mark_payment_settled(payment_hash):
#     """Mark payment and related transaction as settled, and update wallet."""
#     payment = Payment.query.filter_by(payment_hash=payment_hash).first()
#     if not payment or payment.status == "settled":
#         return False

#     payment.status = "settled"
#     payment.settled_at = datetime.utcnow()

#     txn = Transaction.query.get(payment.order_id)
#     if txn:
#         txn.status = "settled"

#         wallet = Wallet.query.filter_by(user_id=txn.user_id).first()
#         if wallet:
#             wallet.balance_sats += payment.amount_sats

#     db.session.commit()
#     return True

# def stream_invoices(callback):
#     """Continuously stream invoices from LND and trigger callback on settlement."""
#     for invoice in lnd.subscribe_invoices():
#         if invoice.settled:
#             mark_payment_settled(invoice.r_hash.hex())
#             callback(invoice)
