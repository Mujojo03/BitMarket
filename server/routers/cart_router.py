from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.cart_service import add_to_cart, buy_now, checkout_complete


class AddToCartResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        product_id = data.get("product_id")
        quantity = data.get("quantity", 1)

        if not product_id:
            return {"message": "Product ID is required"}, 400

        return add_to_cart(user_id, product_id, quantity)


class CartBuyNowResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        product_id = data.get("product_id")
        quantity = data.get("quantity", 1)

        if not product_id:
            return {"message": "Product ID is required"}, 400
        
        return buy_now(user_id, product_id, quantity)


class CartCheckoutCompleteResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        return checkout_complete(user_id)


def init_cart_routes(api):
    api.add_resource(AddToCartResource, '/cart/add')
    api.add_resource(CartBuyNowResource, '/cart/buy_now')
    api.add_resource(CartCheckoutCompleteResource, '/cart/checkout_complete')
