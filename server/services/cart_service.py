from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Cart, Transaction, Payment,Product
from lnd_service import create_invoice# your existing invoice creator helper

class CartBuyNowResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        
        # For simplicity, assume 1 cart item per user
        cart_item = Cart.query.filter_by(user_id=user_id).first()
        if not cart_item:
            return {"message": "Cart is empty"}, 400
        
         # TODO: Replace with real product price lookup logic
        # price_sats = 1000  # fixed or lookup price of cart_item.product_id
        product = Product.query.filter_by(id=cart_item.product_id).first()
        if not product:
            return {"message": "Product not found"}, 404
        
        if product.price_sats <= 0:
            return {"message": "Invalid product price"}, 400

        price_sats = product.price_sats

        # Create a pending transaction
        txn = Transaction(user_id=user_id, amount_sats=price_sats, status="pending")
        db.session.add(txn)
        db.session.flush()  # flush to get txn.id for Payment foreign key

        # Create a Lightning invoice linked to this transaction
        invoice_data = create_invoice(amount=price_sats, memo=f"Buy Now txn {txn.id}", order_id=txn.id)

        # Create Payment record with invoice info
        payment = Payment(
            order_id=txn.id,
            invoice=invoice_data["payment_request"],
            payment_hash=invoice_data["payment_hash"],
            amount_sats=price_sats,
            status="pending"
        )
        db.session.add(payment)
        db.session.commit()

        return {
            "payment_request": invoice_data["payment_request"],
            "payment_id": payment.id,
            "transaction_id": txn.id
        }, 200
    
class CartCheckoutCompleteResource(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        
        # Clear the cart for this user
        cart_items = Cart.query.filter_by(user_id=user_id).all()
        for item in cart_items:
            db.session.delete(item)
        
        db.session.commit()
        
        return {"message": "Checkout complete. Thank you!"}, 200

