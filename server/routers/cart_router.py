from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.cart_service import buy_now, checkout_complete

class CartBuyNowResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        return buy_now(user_id)


class CartCheckoutCompleteResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        return checkout_complete(user_id)


def init_cart_routes(api):
    api.add_resource(CartBuyNowResource, '/cart/buy_now')
    api.add_resource(CartCheckoutCompleteResource, '/cart/checkout_complete')
