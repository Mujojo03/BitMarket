from flask import Blueprint, request, jsonify
from app.utils.db import get_supabase
from app.utils.auth import token_required
import uuid
from datetime import datetime

bp = Blueprint('products', __name__)
supabase = get_supabase()

@bp.route('/', methods=['GET'])
def get_products():
    try:
        # Parse query parameters
        category_id = request.args.get('categoryId')
        featured = request.args.get('featured')
        seller_id = request.args.get('sellerId')
        limit = request.args.get('limit', type=int)
        
        # Build query
        query = supabase.table('products').select('*, categories(*), users!seller_id(*)')
        
        if category_id:
            query = query.eq('category_id', category_id)
        
        if featured == 'true':
            query = query.eq('is_featured', True)
        
        if seller_id:
            query = query.eq('seller_id', seller_id)
        
        # Execute query
        result = query.execute()
        
        products = result.data
        
        # Format response
        formatted_products = []
        for product in products:
            formatted_products.append({
                'id': product['id'],
                'name': product['name'],
                'description': product['description'],
                'price': product['price'],
                'imageUrl': product['image_url'],
                'categoryId': product['category_id'],
                'sellerId': product['seller_id'],
                'isDigital': product['is_digital'],
                'isFeatured': product['is_featured'],
                'stockQuantity': product['stock_quantity'],
                'rating': product['rating'],
                'reviewCount': product['review_count'],
                'createdAt': product['created_at'],
                'updatedAt': product['updated_at'],
                'category': {
                    'id': product['categories']['id'],
                    'name': product['categories']['name'],
                    'slug': product['categories']['slug'],
                    'imageUrl': product['categories']['image_url']
                } if product['categories'] else None,
                'seller': {
                    'id': product['users']['id'],
                    'fullName': product['users']['full_name'],
                    'isSeller': product['users']['is_seller'],
                    'sellerRating': product['users']['seller_rating'],
                    'sellerSales': product['users']['seller_sales']
                } if product['users'] else None
            })
        
        # Apply limit if specified
        if limit and limit > 0:
            formatted_products = formatted_products[:limit]
        
        return jsonify(formatted_products), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        # Get product by ID
        result = supabase.table('products').select('*, categories(*), users!seller_id(*)').eq('id', product_id).execute()
        
        if not result.data:
            return jsonify({'message': 'Product not found'}), 404
        
        product = result.data[0]
        
        # Format response
        formatted_product = {
            'id': product['id'],
            'name': product['name'],
            'description': product['description'],
            'price': product['price'],
            'imageUrl': product['image_url'],
            'categoryId': product['category_id'],
            'sellerId': product['seller_id'],
            'isDigital': product['is_digital'],
            'isFeatured': product['is_featured'],
            'stockQuantity': product['stock_quantity'],
            'rating': product['rating'],
            'reviewCount': product['review_count'],
            'createdAt': product['created_at'],
            'updatedAt': product['updated_at'],
            'category': {
                'id': product['categories']['id'],
                'name': product['categories']['name'],
                'slug': product['categories']['slug'],
                'imageUrl': product['categories']['image_url']
            } if product['categories'] else None,
            'seller': {
                'id': product['users']['id'],
                'fullName': product['users']['full_name'],
                'isSeller': product['users']['is_seller'],
                'sellerRating': product['users']['seller_rating'],
                'sellerSales': product['users']['seller_sales']
            } if product['users'] else None
        }
        
        return jsonify(formatted_product), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/', methods=['POST'])
@token_required
def create_product(current_user):
    try:
        user_id = current_user['user_id']
        data = request.json
        
        # Check if user is a seller
        user_query = supabase.table('users').select('is_seller').eq('id', user_id).execute()
        
        if not user_query.data or not user_query.data[0]['is_seller']:
            return jsonify({'message': 'Only sellers can create products'}), 403
        
        # Validate required fields
        if not data or not data.get('name') or not data.get('price') or not data.get('categoryId'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Create product
        product_data = {
            'id': str(uuid.uuid4()),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'price': data.get('price'),
            'image_url': data.get('imageUrl'),
            'category_id': data.get('categoryId'),
            'seller_id': user_id,
            'is_digital': data.get('isDigital', False),
            'is_featured': data.get('isFeatured', False),
            'stock_quantity': data.get('stockQuantity', 1),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        result = supabase.table('products').insert(product_data).execute()
        
        if not result.data:
            return jsonify({'message': 'Failed to create product'}), 500
        
        # Get the created product with relations
        product_query = supabase.table('products').select('*, categories(*), users!seller_id(*)').eq('id', product_data['id']).execute()
        
        if not product_query.data:
            return jsonify({'message': 'Product created but failed to retrieve'}), 500
        
        product = product_query.data[0]
        
        # Format response
        formatted_product = {
            'id': product['id'],
            'name': product['name'],
            'description': product['description'],
            'price': product['price'],
            'imageUrl': product['image_url'],
            'categoryId': product['category_id'],
            'sellerId': product['seller_id'],
            'isDigital': product['is_digital'],
            'isFeatured': product['is_featured'],
            'stockQuantity': product['stock_quantity'],
            'rating': product['rating'],
            'reviewCount': product['review_count'],
            'createdAt': product['created_at'],
            'updatedAt': product['updated_at'],
            'category': {
                'id': product['categories']['id'],
                'name': product['categories']['name'],
                'slug': product['categories']['slug'],
                'imageUrl': product['categories']['image_url']
            } if product['categories'] else None,
            'seller': {
                'id': product['users']['id'],
                'fullName': product['users']['full_name'],
                'isSeller': product['users']['is_seller'],
                'sellerRating': product['users']['seller_rating'],
                'sellerSales': product['users']['seller_sales']
            } if product['users'] else None
        }
        
        return jsonify(formatted_product), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/<product_id>', methods=['PUT'])
@token_required
def update_product(current_user, product_id):
    try:
        user_id = current_user['user_id']
        data = request.json
        
        # Check if product exists and belongs to the user
        product_query = supabase.table('products').select('seller_id').eq('id', product_id).execute()
        
        if not product_query.data:
            return jsonify({'message': 'Product not found'}), 404
        
        if product_query.data[0]['seller_id'] != user_id:
            return jsonify({'message': 'You do not have permission to update this product'}), 403
        
        # Update product
        update_data = {}
        
        if 'name' in data:
            update_data['name'] = data['name']
        
        if 'description' in data:
            update_data['description'] = data['description']
        
        if 'price' in data:
            update_data['price'] = data['price']
        
        if 'imageUrl' in data:
            update_data['image_url'] = data['imageUrl']
        
        if 'categoryId' in data:
            update_data['category_id'] = data['categoryId']
        
        if 'isDigital' in data:
            update_data['is_digital'] = data['isDigital']
        
        if 'isFeatured' in data:
            update_data['is_featured'] = data['isFeatured']
        
        if 'stockQuantity' in data:
            update_data['stock_quantity'] = data['stockQuantity']
        
        update_data['updated_at'] = datetime.now().isoformat()
        
        supabase.table('products').update(update_data).eq('id', product_id).execute()
        
        # Get the updated product with relations
        product_query = supabase.table('products').select('*, categories(*), users!seller_id(*)').eq('id', product_id).execute()
        
        if not product_query.data:
            return jsonify({'message': 'Product updated but failed to retrieve'}), 500
        
        product = product_query.data[0]
        
        # Format response
        formatted_product = {
            'id': product['id'],
            'name': product['name'],
            'description': product['description'],
            'price': product['price'],
            'imageUrl': product['image_url'],
            'categoryId': product['category_id'],
            'sellerId': product['seller_id'],
            'isDigital': product['is_digital'],
            'isFeatured': product['is_featured'],
            'stockQuantity': product['stock_quantity'],
            'rating': product['rating'],
            'reviewCount': product['review_count'],
            'createdAt': product['created_at'],
            'updatedAt': product['updated_at'],
            'category': {
                'id': product['categories']['id'],
                'name': product['categories']['name'],
                'slug': product['categories']['slug'],
                'imageUrl': product['categories']['image_url']
            } if product['categories'] else None,
            'seller': {
                'id': product['users']['id'],
                'fullName': product['users']['full_name'],
                'isSeller': product['users']['is_seller'],
                'sellerRating': product['users']['seller_rating'],
                'sellerSales': product['users']['seller_sales']
            } if product['users'] else None
        }
        
        return jsonify(formatted_product), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/<product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    try:
        user_id = current_user['user_id']
        
        # Check if product exists and belongs to the user
        product_query = supabase.table('products').select('seller_id').eq('id', product_id).execute()
        
        if not product_query.data:
            return jsonify({'message': 'Product not found'}), 404
        
        if product_query.data[0]['seller_id'] != user_id:
            return jsonify({'message': 'You do not have permission to delete this product'}), 403
        
        # Delete product
        supabase.table('products').delete().eq('id', product_id).execute()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500