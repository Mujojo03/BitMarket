import logging
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from flask import request
from services.product_order_service import (
    get_product_order, delete_product_order, update_product_order,
    get_all_product_orders, create_product_order
)

logger = logging.getLogger(__name__)

class ProductOrderResource(Resource):
    """
    Resource for handling a single ProductOrder entity.

    Endpoints:
    - GET /product_orders/<product_order_id>    : Retrieve a specific product order by ID.
    - DELETE /product_orders/<product_order_id> : Delete a specific product order by ID.
    - PATCH /product_orders/<product_order_id>  : Partially update fields of a specific product order.
    """

    @jwt_required()
    def get(self, product_order_id):
        """
        GET method to retrieve a product order by ID.

        Args:
            product_order_id (int): The ID of the product order.

        Returns:
            dict: Product order data serialized as a dictionary.
        """
        return get_product_order(product_order_id)

    @jwt_required()
    def delete(self, product_order_id):
        """
        DELETE method to remove a product order by ID.

        Args:
            product_order_id (int): The ID of the product order.

        Returns:
            tuple: JSON message and HTTP status code.
        """
        return delete_product_order(product_order_id)

    @jwt_required()
    def patch(self, product_order_id):
        """
        PATCH method to update parts of a product order.

        Args:
            product_order_id (int): The ID of the product order.

        Request JSON Body:
            Partial fields to update on the product order.

        Returns:
            tuple: Updated product order dict and HTTP status code, or error message and 400 if invalid JSON.
        """
        data = request.get_json()
        if data is None:
            logger.warning("PATCH /product_orders/%s - Missing or invalid JSON body", product_order_id)
            return {"message": "Missing or invalid JSON body"}, 400
        return update_product_order(product_order_id, data)


class ProductOrderListResource(Resource):
    """
    Resource for handling collection of ProductOrder entities.

    Endpoints:
    - GET /product_orders   : Retrieve a list of all product orders.
    - POST /product_orders  : Create a new product order.
    """

    @jwt_required()
    def get(self):
        """
        GET method to retrieve all product orders.

        Returns:
            tuple: List of product orders as dicts and HTTP 200 status code.
        """
        return get_all_product_orders(), 200

    @jwt_required()
    def post(self):
        """
        POST method to create a new product order.

        Request JSON Body:
            Fields necessary for creating a product order.

        Returns:
            tuple: Created product order dict and HTTP 201 status code, or error message and 400 if invalid JSON.
        """
        data = request.get_json()
        if data is None:
            logger.warning("POST /product_orders - Missing or invalid JSON body")
            return {"message": "Missing or invalid JSON body"}, 400
        return create_product_order(data)


def init_product_order_routes(api):
    """
    Initialize ProductOrder routes on the Flask-RESTful API.

    Args:
        api (flask_restful.Api): The Flask-RESTful API instance.

    Adds:
        /product_orders (ProductOrderListResource)
        /product_orders/<int:product_order_id> (ProductOrderResource)
    """
    api.add_resource(ProductOrderListResource, '/product_orders')
    api.add_resource(ProductOrderResource, '/product_orders/<int:product_order_id>')
