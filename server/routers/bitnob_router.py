# import uuid
# from flask_restful import Resource
# from flask import request
# from services.bitnob_service import create_lightning_invoice, pay_ln_address

# class CreateInvoice(Resource):
#     def post(self):
#         data = request.get_json()
#         satoshis = data.get('satoshis')
#         description = data.get('description')
#         email = data.get('email')

#         # Validate required fields
#         if not satoshis or not description or not email:
#             return {'error': 'satoshis, description, and email are required'}, 400

#         try:
#             invoice = create_lightning_invoice(
#                 satoshis=satoshis,
#                 description=description,
#                 customerEmail=email
#             )
#             return invoice, 200
#         except Exception as e:
#             return {'error': str(e)}, 500

        
# class PayLnAddress(Resource):
#     def post(self):
#         data = request.get_json()
#         lnAddress = data.get('lnAddress')
#         satoshis = data.get('satoshis')

#         if not lnAddress or not satoshis:
#             return {'error': 'lnAddress and satoshis are required'}, 400
        
#         # Generate unique reference
#         reference = str(uuid.uuid4())

#         companyEmail = "payments@yourcompany.com"

#         try:
#             result = pay_ln_address(
#                 lnAddress=lnAddress,
#                 satoshis=satoshis,
#                 reference=reference,
#                 customerEmail=companyEmail
#             )
#             return {'reference': reference, 'result': result}, 200
#         except Exception as e:
#             return {'error': str(e)}, 500

# def init_bitnob_routes(api):
#     api.add_resource(CreateInvoice, '/createinvoice')
#     api.add_resource(PayLnAddress, '/paylnaddress')

import os
import requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from traceback import print_exc          # <-- new

load_dotenv()

bitnob_bp = Blueprint("bitnob", __name__)

# Environment defaults
BITNOB_BASE_URL = os.getenv(
    "BITNOB_BASE_URL",
    "https://sandboxapi.bitnob.co/api/v1"   # change to https://api.bitnob.co/api/v1 for live
)
BITNOB_API_KEY = os.getenv("BITNOB_API_KEY")    # from .env

@bitnob_bp.route("/invoices/create", methods=["POST"])
def create_invoice():
    try:
        data = request.get_json()

        payload = {
            "satoshis":      data.get("satoshis"),
            "customerEmail": data.get("customerEmail"),
            "description":   data.get("description"),
        }

        headers = {
            "Authorization": f"Bearer {BITNOB_API_KEY}",
            "Content-Type":  "application/json",
            "Accept":        "application/json"
        }

        res = requests.post(
            f"{BITNOB_BASE_URL}/wallets/ln/createinvoice",
            headers=headers,
            json=payload,
            timeout=10
        )
        res.raise_for_status()                 # will jump to except if not 2xx
        return jsonify(res.json()), res.status_code

    except Exception as e:
        # full traceback to terminal
        print("\n----- Bitnob proxy error -----")
        print_exc()
        print("--------------------------------\n")
        # send a clean error back to frontend
        return jsonify({"error": str(e)}), 502

