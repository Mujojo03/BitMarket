from flask import Flask,request,jsonify,session
from flask_migrate import Migrate
from flask_restful import Resource,Api
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity
# models
from models.db import db
from models.cart import Cart
from models.order import Order
from models.transaction import Transaction
from models.wallet import Wallet
from models.product_order import ProductOrder
from models.payment import Payment
from models.escrow import Escrow
from models.user_role import UserRole
from models.permission import ROLE_PERMISSIONS
from models.wallet import Wallet
from models.product import Product
from models.role import Role
from models.user import User


app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bitmarket.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'



CORS(app)
# Initialize Bcrypt with the app
bcrypt = Bcrypt(app)

migrate = Migrate(app,db)
db.init_app(app)
jwt = JWTManager(app)



# REGISTRATION

# Helper function to handle user registration
def register_user(data, role_title):
    """
    Register a new user with a specified role ('buyer' or 'seller').

    Args:
        data (dict): Contains username, email, and password.
        role_title (str): Role to assign to the user.

    Returns:
        JSON response with status, message, and JWT access token.
    """
    # Validate the incoming data
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Missing required fields', 'status': 400})

    # Check if the email already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'User with this email already exists', 'status': 400})

    # Create a new user
    new_user = User(username=data['username'], email=data['email'])
    new_user.password = data['password']  # Set the password (uses the setter)
    db.session.add(new_user)
    db.session.commit()

    # Assign the specified role (buyer or seller)
    role = Role.query.filter_by(title=role_title).first()
    if role:
        db.session.add(UserRole(user_id=new_user.id, role_id=role.id))
        db.session.commit()
        print(f"Assigned role {role.title} to user {new_user.username}")

    # Generate the JWT token
    # access_token = create_access_token(identity=new_user.id)
    access_token = create_access_token(identity=str(new_user.id))
    
    
    return jsonify({
        'message': f'{role_title.capitalize()} registered successfully',
        'status': 201,
        'data': new_user.to_dict(),
        'access_token': access_token
    })

# RegisterBuyer class
class RegisterBuyer(Resource):
    """Endpoint to register a new buyer."""
    def post(self):
        data = request.get_json()
        return register_user(data, 'buyer')

# RegisterSeller class
class RegisterSeller(Resource):
    """Endpoint to register a new seller."""
    def post(self):
        data = request.get_json()
        return register_user(data, 'seller')

# API Endpoints
api.add_resource(RegisterBuyer, '/register/buyer')
api.add_resource(RegisterSeller, '/register/seller')

# LOGIN
# Login
class Login(Resource):
    """
    Login endpoint for users.

    Accepts a POST request with 'email' and 'password' in JSON format.
    If the credentials are correct, returns a JWT access token, user data, and their roles.

    Responses:
    - 200 OK: Returns access token, user info, and roles.
    - 401 Unauthorized: If email or password is invalid.

    Example input:
    {
    "email": "user@example.com",
    "password": "securepassword"
    }

    Note:
    Use the token to access protected endpoints.
    """
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return {"message": "Invalid email or password"}, 401

        # access_token = create_access_token(identity=user.id)
         # Ensure identity is a string
        access_token = create_access_token(identity=str(user.id))  # Cast to string
        roles = [ur.role.title for ur in user.roles]

        return {
            "access_token": access_token,
            "user": user.to_dict(),
            "roles": roles
        }, 200

class Logout(Resource):
    """
    Logout endpoint.

    Accepts a POST request from an authenticated user.
    This is a placeholder endpoint — it does not perform token blacklisting or invalidate the JWT.

    Purpose:
    - Used to trigger client-side logout actions (e.g., clearing tokens from storage).
    - Can be extended in the future to support JWT blacklisting.

    Requires:
    - A valid JWT access token in the Authorization header.
    """

    @jwt_required()
    def post(self):
        return {"message": "Successfully logged out"}, 200
    
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')


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
    
api.add_resource(ResetPassword, '/reset-password')

# UsersResource Class: Get list of users (only for admins)
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


        users = [user.to_dict() for user in User.query.all()]
        return {"message": "Users fetched successfully", "status": 200, "data": users}, 200

# UserByID Class: Get, Patch, and Delete a specific user by ID
class UserByID(Resource):
    """
    Endpoint to get, update, or delete a user by ID.

    GET:
    - Returns the user's information if the requester is the user themselves or has permission.
    - Includes user roles in the response.

    PATCH:
    - Allows updating user's username, email, or password.
    - Only the user or someone with 'edit_users' permission can update.

    DELETE:
    - Deletes the user from the database.
    - Only the user or someone with 'delete_users' permission can delete.

    Requires:
    - A valid JWT access token in the Authorization header.
    """
    @jwt_required()
    def get(self, id):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        # Allow the user to access their own data or if they are an admin
        user = User.query.get(id)
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

        # Allow user to update their own data or if they are an admin
        user = User.query.get(id)
        if not user:
            return {"message": "User not found"}, 404

        # if user.id != current_user_id and not has_role(current_user, "admin"):
        #     return {"message": "Unauthorized"}, 403
        if user.id != current_user_id and not current_user.has_permission("edit_users"):
            return {"message": "Unauthorized"}, 403

        data = request.get_json()
        for attr, value in data.items():
            if attr in ['username', 'email']:
                setattr(user, attr, value)
            if attr == 'password':
                user.password = value  # triggers setter

        db.session.commit()
        return {"message": "User updated successfully", "status": 200, "data": user.to_dict()}, 200
    @jwt_required()
    def delete(self, id):
    # Get the currently authenticated user's ID
        current_user_id = get_jwt_identity()

    # Fetch the user to be deleted
        user = User.query.get(id)
        if not user:
            return {"message": "User not found"}, 404

    # Delete the user from the database
        db.session.delete(user)

        try:
            db.session.commit()  # Commit the transaction
            return {"message": "User deleted successfully", "status": 200}, 200
        except Exception as e:
            db.session.rollback()  # Rollback in case of any error
            return {"message": f"Error deleting user: {str(e)}", "status": 500}, 500

    #  @jwt_required()
    # def delete(self, id):
    #     current_user_id = get_jwt_identity()
    #     current_user = User.query.get(current_user_id)

    #     # Allow user to delete their own account or if they are an admin
    #     user = User.query.get(id)
    #     if not user:
    #         return {"message": "User not found"}, 404

    #     # if user.id != current_user_id and not has_role(current_user, "admin"):
    #     #     return {"message": "Unauthorized"}, 403
    #     if user.id != current_user_id and not current_user.has_permission("delete_users"):
    #         return {"message": "Unauthorized"}, 403

    #     db.session.delete(user)
    #     db.session.commit()
    #     return {"message": "User deleted successfully", "status": 200}, 200
    
api.add_resource(UsersResource, '/users')
api.add_resource(UserByID, '/users/<int:id>')



if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)
