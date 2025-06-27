import logging
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from flask import request
from services.order_service import (
    get_order, delete_order, update_order,
    get_all_orders, create_order
)

logger = logging.getLogger(__name__)

class OrderResource(Resource):
    @jwt_required()
    def get(self, order_id):
        return get_order(order_id)

    @jwt_required()
    def delete(self, order_id):
        return delete_order(order_id)

    @jwt_required()
    def patch(self, order_id):
        data = request.get_json()
        if data is None:
            logger.warning("PATCH /orders/%s - Missing or invalid JSON body", order_id)
            return {"message": "Missing or invalid JSON body"}, 400
        return update_order(order_id, data)

class OrderListResource(Resource):
    @jwt_required()
    def get(self):
        return get_all_orders(), 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        if data is None:
            logger.warning("POST /orders - Missing or invalid JSON body")
            return {"message": "Missing or invalid JSON body"}, 400
        return create_order(data)

def init_order_routes(api):
    api.add_resource(OrderListResource, '/orders')
    api.add_resource(OrderResource, '/orders/<int:order_id>')