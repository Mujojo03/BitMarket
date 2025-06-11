from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from services.profile_service import get_profile, update_profile

class UserProfileResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = get_profile(user_id)
        if not user:
            return {"message": "User not found"}, 404
        return user.to_dict(), 200

    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        user, error = update_profile(user_id, data)
        if error:
            return {"message": error}, 400 if error == "No username provided" else 404

        return {"message": "Profile updated", "data": user.to_dict()}, 200
    

def init_profile_routes(api):
    api.add_resource(UserProfileResource,  "/users/<int:id>/profile")