from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from dtos.product_dto import ProductResponseDTO
from services.product_service import (
    create_product,
    get_all_products,
    get_product_by_id,
    get_products_by_category
)
from sqlalchemy.exc import SQLAlchemyError


class ProductCreate(Resource):
    @jwt_required()
    def post(self):
        try:
            current_user = User.query.get(get_jwt_identity())
            if not current_user.has_permission("create_products"):
                return {"message": "Forbidden"}, 403

            data = request.get_json()
            category_id = data.get("category_id")
            name = data.get("name")
            description = data.get("description")
            price_sats = data.get("price_sats")
            img_url = data.get("img_url")
            stock_quantity = data.get("stock_quantity")

            if not category_id or not name or not price_sats or not stock_quantity:
                return {"message": "Category ID, name, price, and stock quantity are required"}, 400

            product = create_product(
                seller_id=current_user.id,
                category_id=category_id,
                name=name,
                description=description,
                price_sats=price_sats,
                img_url=img_url,
                stock_quantity=stock_quantity
            )

            product_data = ProductResponseDTO().dump(product)
            return product_data, 201
        except Exception as e:
            return {"message": f"Error creating product: {str(e)}"}, 400


class ProductList(Resource):
    def get(self):
        try:
            products = get_all_products()
            if not products:
                return {"message": "No products found"}, 404
            product_data = ProductResponseDTO(many=True).dump(products)
            return product_data, 200
        except SQLAlchemyError as e:
            return {"message": f"Database error: {str(e)}"}, 500
        except Exception as e:
            return {"message": f"Error retrieving products: {str(e)}"}, 400


class ProductByID(Resource):
    def get(self, id):
        try:
            product = get_product_by_id(id)
            if not product:
                return {"message": "Product not found"}, 404
            product_data = ProductResponseDTO().dump(product)
            return product_data, 200
        except SQLAlchemyError as e:
            return {"message": f"Database error: {str(e)}"}, 500
        except Exception as e:
            return {"message": f"Error retrieving product: {str(e)}"}, 400


class ProductByCategory(Resource):
    def get(self, category_id):
        try:
            products = get_products_by_category(category_id)
            if not products:
                return {"message": "No products found in this category"}, 404
            product_data = ProductResponseDTO(many=True).dump(products)
            return product_data, 200
        except SQLAlchemyError as e:
            return {"message": f"Database error: {str(e)}"}, 500
        except Exception as e:
            return {"message": f"Error retrieving products by category: {str(e)}"}, 400


def init_product_routes(api):
    api.add_resource(ProductCreate, '/products/create')
    api.add_resource(ProductList, '/products')
    api.add_resource(ProductByID, '/products/<int:id>')
    api.add_resource(ProductByCategory, '/products/category/<int:category_id>')