from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.lnd_service import create_invoice  # Adjust if needed
from services.lnd_service import pay_invoice

invoice_bp = Blueprint('invoice', __name__)

@invoice_bp.route('/invoice', methods=['POST'])
# @jwt_required()
def create_invoice_route():
    """
    POST /invoice
    Creates a Lightning invoice and stores it in the Payment model.
    Requires JWT auth.
    
    JSON Body: { "amount": 1500, "memo": "optional", "order_id": "optional" }
    """
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"error": "Missing 'amount' field"}), 400

    amount = data['amount']
    memo = data.get('memo', 'Invoice')
    order_id = data.get('order_id')
    # user_id = get_jwt_identity()
    # user_id=user_id
    try:
        result = create_invoice(amount=amount, memo=memo, order_id=order_id)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@invoice_bp.route('/invoice/pay', methods=['POST'])
# @jwt_required()
def pay_invoice_route():
    """
    Pay a Lightning invoice from Bob's node.
    POST /invoice/pay
    JSON: { "payment_request": "lnbc1..." }
    """
    data = request.get_json()
    if not data or 'payment_request' not in data:
        return jsonify({"error": "Missing 'payment_request' field"}), 400

    try:
        result = pay_invoice(data['payment_request'])
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
