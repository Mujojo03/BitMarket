# routers/transaction_router.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from flask import request
from services.transaction_service import (
    get_transaction, delete_transaction, update_transaction,
    get_all_transactions, create_transaction
)

class TransactionResource(Resource):
    @jwt_required()
    def get(self, transaction_id):
        return get_transaction(transaction_id)

    @jwt_required()
    def delete(self, transaction_id):
        return delete_transaction(transaction_id)

    @jwt_required()
    def patch(self, transaction_id):
        data = request.get_json(force=True)
        return update_transaction(transaction_id, data)

class TransactionListResource(Resource):
    @jwt_required()
    def get(self):
        return get_all_transactions(), 200

    @jwt_required()
    def post(self):
        data = request.get_json(force=True)
        return create_transaction(data)

def init_transaction_routes(api):
    api.add_resource(TransactionListResource, '/transactions')
    api.add_resource(TransactionResource, '/transactions/<int:transaction_id>')
