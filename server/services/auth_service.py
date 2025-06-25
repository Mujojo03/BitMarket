from flask_jwt_extended import create_access_token
from models.user import User
from models.role import Role
from models.user_role import UserRole
from models.db import db

def register_user(data, role_title):
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return {'message': 'Missing required fields', 'status': 400}

    # Check if the email already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return {'message': 'User with this email already exists', 'status': 400}

    # Create a new user
    new_user = User(username=data['username'], email=data['email'])
    new_user.password = data['password']  # Set the password (uses the setter)
    db.session.add(new_user)
    db.session.commit()

    # DEBUG: Print the registered user's email
    print("✅ REGISTERED USER:", new_user.email)

    # Assign the specified role (buyer or seller)
    role = Role.query.filter_by(title=role_title).first()
    if role:
        db.session.add(UserRole(user_id=new_user.id, role_id=role.id))
        db.session.commit()

    # Generate the JWT token
    access_token = create_access_token(identity=str(new_user.id))

    return {
        'message': f'{role_title.capitalize()} registered successfully',
        'status': 201,
        'data': new_user.to_dict(),
        'access_token': access_token
    }

def login_user(data):
    # DEBUG: Print what was sent from frontend
    print("LOGIN DEBUG:", data['email'], data['password'])

    # Fetch the user by email
    user = User.query.filter_by(email=data['email']).first()
    
    # DEBUG: Check if the user was found
    print("USER FOUND:", user.email if user else None)
    
    # DEBUG: Check password match
    print("PASSWORD CHECK:", user.check_password(data['password']) if user else None)

    # Validate login
    if not user or not user.check_password(data['password']):
        return {"message": "Invalid email or password"}, 401

    # user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return {"message": "Invalid email or password"}, 401

    access_token = create_access_token(identity=str(user.id))
    roles = [ur.role.title for ur in user.roles]

    return {
        "access_token": access_token,
        "user": user.to_dict(),
        "roles": roles
    }, 200

