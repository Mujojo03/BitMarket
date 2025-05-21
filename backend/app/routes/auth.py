from flask import Blueprint, request, jsonify
from app.utils.db import get_supabase
from app.utils.auth import generate_jwt, token_required
import uuid
from datetime import datetime

bp = Blueprint('auth', __name__)
supabase = get_supabase()

@bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password') or not data.get('fullName'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('fullName')
    
    # Check if user already exists
    user_query = supabase.table('users').select('*').eq('email', email).execute()
    
    if user_query.data:
        return jsonify({'message': 'User already exists'}), 409
    
    # Create user in Supabase Auth
    try:
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        user_id = auth_response.user.id
        
        # Create user in our users table
        user_data = {
            'id': user_id,
            'email': email,
            'full_name': full_name,
            'is_seller': False
        }
        
        supabase.table('users').insert(user_data).execute()
        
        # Generate JWT token
        token = generate_jwt(user_data)
        
        return jsonify({
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'fullName': full_name,
                'isSeller': False
            }
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    email = data.get('email')
    password = data.get('password')
    
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        user_id = auth_response.user.id
        
        # Get user data from our users table
        user_query = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_query.data:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = user_query.data[0]
        
        # Generate JWT token
        token = generate_jwt(user_data)
        
        return jsonify({
            'token': token,
            'user': {
                'id': user_data['id'],
                'email': user_data['email'],
                'fullName': user_data['full_name'],
                'isSeller': user_data['is_seller'],
                'sellerRating': user_data['seller_rating'],
                'sellerSales': user_data['seller_sales'],
                'lightningAddress': user_data.get('lightning_address')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 401

@bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    try:
        user_id = current_user['user_id']
        
        # Get user data from our users table
        user_query = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_query.data:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = user_query.data[0]
        
        return jsonify({
            'user': {
                'id': user_data['id'],
                'email': user_data['email'],
                'fullName': user_data['full_name'],
                'isSeller': user_data['is_seller'],
                'sellerRating': user_data['seller_rating'],
                'sellerSales': user_data['seller_sales'],
                'lightningAddress': user_data.get('lightning_address')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/become-seller', methods=['POST'])
@token_required
def become_seller(current_user):
    try:
        user_id = current_user['user_id']
        
        # Update user to become a seller
        supabase.table('users').update({
            'is_seller': True,
            'seller_since': datetime.now().isoformat()
        }).eq('id', user_id).execute()
        
        # Get updated user data
        user_query = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_query.data:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = user_query.data[0]
        
        return jsonify({
            'user': {
                'id': user_data['id'],
                'email': user_data['email'],
                'fullName': user_data['full_name'],
                'isSeller': user_data['is_seller'],
                'sellerRating': user_data['seller_rating'],
                'sellerSales': user_data['seller_sales'],
                'lightningAddress': user_data.get('lightning_address')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/update-profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    try:
        user_id = current_user['user_id']
        data = request.json
        
        update_data = {}
        
        if 'fullName' in data:
            update_data['full_name'] = data['fullName']
        
        if 'lightningAddress' in data:
            update_data['lightning_address'] = data['lightningAddress']
        
        # Update user profile
        supabase.table('users').update(update_data).eq('id', user_id).execute()
        
        # Get updated user data
        user_query = supabase.table('users').select('*').eq('id', user_id).execute()
        
        if not user_query.data:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = user_query.data[0]
        
        return jsonify({
            'user': {
                'id': user_data['id'],
                'email': user_data['email'],
                'fullName': user_data['full_name'],
                'isSeller': user_data['is_seller'],
                'sellerRating': user_data['seller_rating'],
                'sellerSales': user_data['seller_sales'],
                'lightningAddress': user_data.get('lightning_address')
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500