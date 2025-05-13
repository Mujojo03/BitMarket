from flask import Blueprint, request, jsonify
from app.utils.db import get_supabase
from app.utils.auth import token_required
import uuid
from datetime import datetime

bp = Blueprint('orders', __name__)
supabase = get_supabase()

@bp.route('/', methods=['GET'])
@token_required
def get_orders(current_user):
    try:
        user_id = current_user['user_id']
        
        # Get user's orders
        orders_query = supabase.table('orders').select('*').eq('buyer_id', user_id).execute()
        
        orders = orders_query.data
        
        # Get order items for each order
        formatted_orders = []
        for order in orders:
            order_items_query = supabase.table('order_items').select('*, products(*)').eq('order_id', order['id']).execute()
            
            order_items = []
            for item in order_items_query.data:
                order_items.append({
                    'id': item['id'],
                    'orderId': item['order_id'],
                    'productId': item['product_id'],
                    'quantity': item['quantity'],
                    'price': item['price'],
                    'product': {
                        'id': item['products']['id'],
                        'name': item['products']['name'],
                        'imageUrl': item['products']['image_url'],
                        'isDigital': item['products']['is_digital']
                    } if item['products'] else None
                })
            
            formatted_orders.append({
                'id': order['id'],
                'buyerId': order['buyer_id'],
                'status': order['status'],
                'totalAmount': order['total_amount'],
                'shippingAddress': order['shipping_address'],
                'lightningInvoice': order['lightning_invoice'],
                'createdAt': order['created_at'],
                'updatedAt': order['updated_at'],
                'orderItems': order_items
            })
        
        return jsonify(formatted_orders), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/<order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    try:
        user_id = current_user['user_id']
        
        # Get order
        order_query = supabase.table('orders').select('*').eq('id', order_id).execute()
        
        if not order_query.data:
            return jsonify({'message': 'Order not found'}), 404
        
        order = order_query.data[0]
        
        # Check if user is the buyer
        if order['buyer_id'] != user_id:
            # Check if user is the seller of any product in the order
            order_items_query = supabase.table('order_items').select('products(seller_id)').eq('order_id', order_id).execute()
            
            is_seller = False
            for item in order_items_query.data:
                if item['products'] and item['products']['seller_id'] == user_id:
                    is_seller = True
                    break
            
            if not is_seller:
                return jsonify({'message': 'You do not have permission to view this order'}), 403
        
        # Get order items
        order_items_query = supabase.table('order_items').select('*, products(*)').eq('order_id', order_id).execute()
        
        order_items = []
        for item in order_items_query.data:
            order_items.append({
                'id': item['id'],
                'orderId': item['order_id'],
                'productId': item['product_id'],
                'quantity': item['quantity'],
                'price': item['price'],
                'product': {
                    'id': item['products']['id'],
                    'name': item['products']['name'],
                    'imageUrl': item['products']['image_url'],
                    'isDigital': item['products']['is_digital']
                } if item['products'] else None
            })
        
        formatted_order = {
            'id': order['id'],
            'buyerId': order['buyer_id'],
            'status': order['status'],
            'totalAmount': order['total_amount'],
            'shippingAddress': order['shipping_address'],
            'lightningInvoice': order['lightning_invoice'],
            'createdAt': order['created_at'],
            'updatedAt': order['updated_at'],
            'orderItems': order_items
        }
        
        return jsonify(formatted_order), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/', methods=['POST'])
@token_required
def create_order(current_user):
    try:
        user_id = current_user['user_id']
        data = request.json
        
        # Validate required fields
        if not data or not data.get('cartItems') or not data.get('shippingAddress'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        cart_items = data.get('cartItems')
        shipping_address = data.get('shippingAddress')
        
        # Calculate total amount
        total_amount = 0
        for item in cart_items:
            product_query = supabase.table('products').select('price').eq('id', item['productId']).execute()
            
            if not product_query.data:
                return jsonify({'message': f'Product with ID {item["productId"]} not found'}), 404
            
            product_price = product_query.data[0]['price']
            total_amount += product_price * item['quantity']
        
        # Create order
        order_id = str(uuid.uuid4())
        order_data = {
            'id': order_id,
            'buyer_id': user_id,
            'status': 'pending',
            'total_amount': total_amount,
            'shipping_address': shipping_address,
            'lightning_invoice': f'lnbc{total_amount}n1p3...',  # Mock invoice
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        supabase.table('orders').insert(order_data).execute()
        
        # Create order items
        order_items = []
        for item in cart_items:
            product_query = supabase.table('products').select('price').eq('id', item['productId']).execute()
            product_price = product_query.data[0]['price']
            
            order_item_data = {
                'id': str(uuid.uuid4()),
                'order_id': order_id,
                'product_id': item['productId'],
                'quantity': item['quantity'],
                'price': product_price,
                'created_at': datetime.now().isoformat()
            }
            
            supabase.table('order_items').insert(order_item_data).execute()
            
            order_items.append({
                'id': order_item_data['id'],
                'orderId': order_item_data['order_id'],
                'productId': order_item_data['product_id'],
                'quantity': order_item_data['quantity'],
                'price': order_item_data['price']
            })
        
        # Clear cart
        supabase.table('cart_items').delete().eq('user_id', user_id).execute()
        
        # Return created order
        formatted_order = {
            'id': order_data['id'],
            'buyerId': order_data['buyer_id'],
            'status': order_data['status'],
            'totalAmount': order_data['total_amount'],
            'shippingAddress': order_data['shipping_address'],
            'lightningInvoice': order_data['lightning_invoice'],
            'createdAt': order_data['created_at'],
            'updatedAt': order_data['updated_at'],
            'orderItems': order_items
        }
        
        return jsonify(formatted_order), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@bp.route('/<order_id>/status', methods=['PUT'])
@token_required
def update_order_status(current_user, order_id):
    try:
        user_id = current_user['user_id']
        data = request.json
        
        if not data or not data.get('status'):
            return jsonify({'message': 'Missing status field'}), 400
        
        new_status = data.get('status')
        
        # Check if order exists
        order_query = supabase.table('orders').select('*').eq('id', order_id).execute()
        
        if not order_query.data:
            return jsonify({'message': 'Order not found'}), 404
        
        order = order_query.data[0]
        
        # Check if user is the buyer or seller
        is_buyer = order['buyer_id'] == user_id
        
        is_seller = False
        if not is_buyer:
            # Check if user is the seller of any product in the order
            order_items_query = supabase.table('order_items').select('products(seller_id)').eq('order_id', order_id).execute()
            
            for item in order_items_query.data:
                if item['products'] and item['products']['seller_id'] == user_id:
                    is_seller = True
                    break
        
        if not is_buyer and not is_seller:
            return jsonify({'message': 'You do not have permission to update this order'}), 403
        
        # Update order status
        supabase.table('orders').update({
            'status': new_status,
            'updated_at': datetime.now().isoformat()
        }).eq('id', order_id).execute()
        
        # Get updated order
        updated_order_query = supabase.table('orders').select('*').eq('id', order_id).execute()
        updated_order = updated_order_query.data[0]
        
        # Get order items
        order_items_query = supabase.table('order_items').select('*, products(*)').eq('order_id', order_id).execute()
        
        order_items = []
        for item in order_items_query.data:
            order_items.append({
                'id': item['id'],
                'orderId': item['order_id'],
                'productId': item['product_id'],
                'quantity': item['quantity'],
                'price': item['price'],
                'product': {
                    'id': item['products']['id'],
                    'name': item['products']['name'],
                    'imageUrl': item['products']['image_url'],
                    'isDigital': item['products']['is_digital']
                } if item['products'] else None
            })
        
        formatted_order = {
            'id': updated_order['id'],
            'buyerId': updated_order['buyer_id'],
            'status': updated_order['status'],
            'totalAmount': updated_order['total_amount'],
            'shippingAddress': updated_order['shipping_address'],
            'lightningInvoice': updated_order['lightning_invoice'],
            'createdAt': updated_order['created_at'],
            'updatedAt': updated_order['updated_at'],
            'orderItems': order_items
        }
        
        return jsonify(formatted_order), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500