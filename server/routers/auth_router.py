from flask import request, jsonify
from flask_restful import Resource
from services.auth_service import register_user, login_user

class RegisterBuyer(Resource):
    def post(self):
        data = request.get_json()
        return register_user(data, 'buyer')

class RegisterSeller(Resource):
    def post(self):
        data = request.get_json()
        return register_user(data, 'seller')

class Login(Resource):
    def post(self):
        data = request.get_json()
        return login_user(data)

class Logout(Resource):
    def post(self):
        return {"message": "Successfully logged out"}, 200

# Group route registrations into a function
def init_auth_routes(api):
    api.add_resource(RegisterBuyer, '/register/buyer')
    api.add_resource(RegisterSeller, '/register/seller')
    api.add_resource(Login, '/login')
    api.add_resource(Logout, '/logout')
