# routers/payment_router.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from flask import request
from services.payment_service import (
    get_payment, delete_payment, update_payment,
    get_all_payments, create_payment
)

class PaymentResource(Resource):
    @jwt_required()
    def get(self, payment_id):
        return get_payment(payment_id)

    @jwt_required()
    def delete(self, payment_id):
        return delete_payment(payment_id)

    @jwt_required()
    def patch(self, payment_id):
        data = request.get_json(force=True)
        return update_payment(payment_id, data)

class PaymentListResource(Resource):
    @jwt_required()
    def get(self):
        return get_all_payments(), 200

    @jwt_required()
    def post(self):
        data = request.get_json(force=True)
        return create_payment(data)

def init_payment_routes(api):
    api.add_resource(PaymentListResource, '/payments')
    api.add_resource(PaymentResource, '/payments/<int:payment_id>')
