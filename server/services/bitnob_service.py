from utils.http_client import bitnob_post

def create_lightning_invoice(satoshis, description, customerEmail):
    data = {
        "satoshis": satoshis,
        "customerEmail": customerEmail,
        "description": description
    }
    return bitnob_post("/wallets/ln/createinvoice", data)

def pay_ln_address(lnAddress, satoshis, reference, customerEmail):
    data = {
        "lnAddress": lnAddress,
        "satoshis": satoshis,
        "reference": reference,
        "customerEmail": customerEmail
    }
    return bitnob_post("/lnurl/paylnaddress", data)