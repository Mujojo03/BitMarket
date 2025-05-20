import grpc
import os
from .lightning_stub import lightning_pb2 as ln
from .lightning_stub import lightning_pb2_grpc as lnrpc
from dotenv import load_dotenv

load_dotenv(dotenv_path='server/.env')

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
    
    def send_payment_sync(self, payment_request):
        req = ln.SendRequest(payment_request=payment_request)
        return self.stub.SendPaymentSync(req)
    