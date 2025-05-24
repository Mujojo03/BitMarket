import uuid
from flask_restful import Resource
from flask import request
from services.bitnob_service import create_lightning_invoice, pay_ln_address

class CreateInvoice(Resource):
    def post(self):
        data = request.get_json()
        satoshis = data.get('satoshis')
        description = data.get('description')
        email = data.get('email')

        # Validate required fields
        if not satoshis or not description or not email:
            return {'error': 'satoshis, description, and email are required'}, 400

        try:
            invoice = create_lightning_invoice(
                satoshis=satoshis,
                description=description,
                customerEmail=email
            )
            return invoice, 200
        except Exception as e:
            return {'error': str(e)}, 500

        
class PayLnAddress(Resource):
    def post(self):
        data = request.get_json()
        lnAddress = data.get('lnAddress')
        satoshis = data.get('satoshis')

        if not lnAddress or not satoshis:
            return {'error': 'lnAddress and satoshis are required'}, 400
        
        # Generate unique reference
        reference = str(uuid.uuid4())

        companyEmail = "payments@yourcompany.com"

        try:
            result = pay_ln_address(
                lnAddress=lnAddress,
                satoshis=satoshis,
                reference=reference,
                customerEmail=companyEmail
            )
            return {'reference': reference, 'result': result}, 200
        except Exception as e:
            return {'error': str(e)}, 500

def init_bitnob_routes(api):
    api.add_resource(CreateInvoice, '/createinvoice')
    api.add_resource(PayLnAddress, '/paylnaddress')
