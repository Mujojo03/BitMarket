from flask import request
from flask_restful import Resource
from flask_jwt_extended import current_user, jwt_required, get_jwt_identity
from models import db
from services.user_service import get_user_by_id, get_all_users, update_user, delete_user
from models import User

class ResetPassword(Resource):
    """Endpoint to reset user password via email."""
    def post(self):
        data = request.get_json()
        email = data.get('email')
        new_password = data.get('new_password')

        if not email or not new_password:
            return {"message": "Email and new password are required"}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "User not found"}, 404

        user.password = new_password  # triggers password setter
        db.session.commit()
        return {"message": "Password reset successful"}, 200

class UsersResource(Resource):
    """Admin-only endpoint to list all users."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        # Admins can view all users
        # if not has_role(current_user, "admin"):
        #     return {"message": "Unauthorized"}, 403

        if not current_user.has_permission("view_users"):
            return {"message": "Forbidden"}, 403

        users = [user.to_dict() for user in get_all_users()]
        return {"message": "Users fetched successfully", "status": 200, "data": users}, 200

class UserByID(Resource):
    """Endpoint to get, update, or delete a user by ID."""
    
    @jwt_required()
    def get(self, id):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        user = get_user_by_id(id)
        if not user:
            return {"message": "User not found"}, 404

        # if user.id != current_user_id and not has_role(current_user, "admin"):
        #     return {"message": "Unauthorized"}, 403
        if user.id != current_user_id and not current_user.has_permission("view_users"):
            return {"message": "Unauthorized"}, 403

        user_data = user.to_dict()
        user_data["roles"] = [ur.role.title for ur in user.roles]
        return {"message": "User fetched successfully", "status": 200, "data": user_data}, 200

    @jwt_required()
    def patch(self, id):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        user = get_user_by_id(id)
        if not user:
            return {"message": "User not found"}, 404

        # if user.id != current_user_id and not has_role(current_user, "admin"):
        #     return {"message": "Unauthorized"}, 403
        if user.id != current_user_id and not current_user.has_permission("edit_users"):
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        updated_user = update_user(user, data)
        return {"message": "User updated successfully", "status": 200, "data": updated_user.to_dict()}, 200

    @jwt_required()
    def delete(self, id):
        current_user_id = get_jwt_identity()

        user = get_user_by_id(id)
        if not user:
            return {"message": "User not found"}, 404

        # if user.id != current_user_id and not has_role(current_user, "admin"):
        #     return {"message": "Unauthorized"}, 403
        if user.id != current_user_id and not current_user.has_permission("delete_users"):
            return {"message": "Unauthorized"}, 403

        try:
            delete_user(user)
            return {"message": "User deleted successfully", "status": 200}, 200
        except Exception as e:
            return {"message": f"Error deleting user: {str(e)}", "status": 500}, 500
        
# Group route users into a function
def init_user_routes(api):
    api.add_resource(ResetPassword, '/reset-password')
    api.add_resource(UsersResource, '/users')
    api.add_resource(UserByID, '/users/<int:id>')
