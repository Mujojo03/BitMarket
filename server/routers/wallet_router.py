# routers/wallet_router.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from flask import request
from services.wallet_service import (
    get_wallet, delete_wallet, update_wallet,
    get_all_wallets, create_wallet
)

class WalletResource(Resource):
    @jwt_required()
    def get(self, wallet_id):
        return get_wallet(wallet_id)

    @jwt_required()
    def delete(self, wallet_id):
        return delete_wallet(wallet_id)

    @jwt_required()
    def patch(self, wallet_id):
        data = request.get_json(force=True)
        return update_wallet(wallet_id, data)

class WalletListResource(Resource):
    @jwt_required()
    def get(self):
        return get_all_wallets(), 200

    @jwt_required()
    def post(self):
        data = request.get_json(force=True)
        return create_wallet(data)

def init_wallet_routes(api):
    api.add_resource(WalletListResource, '/wallets')
    api.add_resource(WalletResource, '/wallets/<int:wallet_id>')
