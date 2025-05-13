from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from services.category_service import (
    get_all_categories, get_category_by_id,
    create_category, update_category, delete_category
)
from dtos.category_dto import CategoryResponseDTO

class CategoryCreate(Resource):
    """POST new category (admin only)"""

    @jwt_required()
    def post(self):
        try:
            current_user = User.query.get(get_jwt_identity())
            if not current_user.has_permission("create_categories"):
                return {"message": "Forbidden"}, 403

            data = request.get_json()
            name = data.get("name")
            if not name:
                return {"message": "Category name is required"}, 400

            category = create_category(name)
            category_data = CategoryResponseDTO().dump(category)
            return category_data, 201
        except Exception as e:
            return {"message": f"Error creating category: {str(e)}"}, 400

class CategoryList(Resource):
    """GET all categories"""

    def get(self):
        try:
            categories = get_all_categories()
            if not categories:
                return {"message": "No categories found"}, 404
            category_data = CategoryResponseDTO(many=True).dump(categories)
            return category_data, 200
        except Exception as e:
            return {"message": f"Error retrieving categories: {str(e)}"}, 400

class CategoryByID(Resource):
    """GET category by ID"""

    def get(self, id):
        try:
            category = get_category_by_id(id)
            if not category:
                return {"message": "Category not found"}, 404
            category_data = CategoryResponseDTO().dump(category)
            return category_data, 200
        except Exception as e:
            return {"message": f"Error retrieving category by ID: {str(e)}"}, 400

class CategoryEdit(Resource):
    """PATCH category by ID (admin only)"""

    @jwt_required()
    def patch(self, id):
        try:
            current_user = User.query.get(get_jwt_identity())
            if not current_user.has_permission("edit_categories"):
                return {"message": "Forbidden"}, 403

            category = get_category_by_id(id)
            if not category:
                return {"message": "Category not found"}, 404

            data = request.get_json()
            name = data.get("name")
            if not name:
                return {"message": "Category name is required"}, 400

            updated_category = update_category(category, name)
            category_data = CategoryResponseDTO().dump(updated_category)
            return category_data, 200
        except Exception as e:
            return {"message": f"Error updating category: {str(e)}"}, 400


class CategoryDelete(Resource):
    """DELETE category by ID (admin only)"""

    @jwt_required()
    def delete(self, id):
        try:
            current_user = User.query.get(get_jwt_identity())
            if not current_user.has_permission("delete_categories"):
                return {
                    "success": False,
                    "message": "Forbidden"
                }, 403

            category = get_category_by_id(id)
            if not category:
                return {
                    "success": False,
                    "message": "Category not found"
                }, 404

            delete_category(category)
            return {
                "success": True,
                "message": "Category deleted successfully"
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": f"Error deleting category: {str(e)}"
            }, 400
        
def init_category_routes(api):
    api.add_resource(CategoryCreate, '/categories/create')
    api.add_resource(CategoryList, '/categories')
    api.add_resource(CategoryByID, '/categories/<int:id>')
    api.add_resource(CategoryEdit, '/categories/<int:id>/edit')
    api.add_resource(CategoryDelete, '/categories/<int:id>/delete')

