from flask import Blueprint, request, jsonify
from services.lnd_service import LNDService

invoice_bp = Blueprint('invoice', __name__)

# Utility function to get an LNDService instance for a node (default is Alice)
def get_lnd_service(node='alice'):
    return LNDService(node=node)

@invoice_bp.route('/invoice', methods=['POST'])
def create_invoice_route():
    """
    POST /invoice
    Creates a Lightning invoice and stores it in the Payment model.

    JSON Body: { "amount": 1500, "memo": "optional", "order_id": "optional", "node": "alice" }
    """
    data = request.get_json()
    if not data or 'amount' not in data:
        return jsonify({"error": "Missing 'amount' field"}), 400

    amount = data['amount']
    memo = data.get('memo', 'Invoice')
    order_id = data.get('order_id')
    node = data.get('node', 'alice')  # Support dynamic node selection if needed

    try:
        lnd = get_lnd_service(node)
        result = lnd.create_invoice(amount=amount, memo=memo, order_id=order_id)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route('/invoice/pay', methods=['POST'])
def pay_invoice_route():
    """
    POST /invoice/pay
    Pays a Lightning invoice from the specified node (default: Bob).

    JSON Body: { "payment_request": "lnbc1...", "node": "bob" }
    """
    data = request.get_json()
    if not data or 'payment_request' not in data:
        return jsonify({"error": "Missing 'payment_request' field"}), 400

    payment_request = data['payment_request']
    node = data.get('node', 'bob')  # Default to Bob for paying

    try:
        lnd = get_lnd_service(node)
        result = lnd.pay_invoice(payment_request)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
