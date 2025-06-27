from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from models.cart import Cart
from models.transaction import Transaction
from models.product import Product
from models.product_order import ProductOrder
from models.order import Order
from models.payment import Payment

import traceback


def add_to_cart(user_id, product_id, quantity):
    """
    Adds a product to the user's cart.

    If the product already exists in the cart, increments the quantity.
    Otherwise, adds it as a new item.

    Args:
        user_id (int): ID of the user adding the item.
        product_id (int): ID of the product to add.
        quantity (int): Quantity of the product to add.

    Returns:
        tuple: A JSON response with status code.
    """
    try:
        existing_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if existing_item:
            existing_item.quantity += quantity
        else:
            new_item = Cart(user_id=user_id, product_id=product_id, quantity=quantity)
            db.session.add(new_item)
        db.session.commit()
        return {"message": "Item added to cart"}, 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"message": "Failed to add to cart", "error": str(e)}, 500
    
# from services.lnd_service import LNDService

def buy_now(user_id, product_id, quantity):
    """
    Processes an instant purchase of a single product.

    Creates an order, associates it with a product and payment,
    generates a Lightning invoice using LND, and logs the transaction.

    Args:
        user_id (int): ID of the buyer.
        product_id (int): ID of the product to purchase.
        quantity (int): Quantity of the product to buy.

    Returns:
        dict: Invoice details if successful.
        tuple: Error message and status code if failed.
    """
    try:
        order = Order(buyer_id=user_id)
        db.session.add(order)
        db.session.flush()

        product = Product.query.get(product_id)
        if not product:
            return {"message": "Product not found"}, 404

        subtotal = product.price_sats * quantity
        order_product = ProductOrder(
            order=order,
            product=product,
            quantity=quantity,
            subtotal=subtotal
        )
        db.session.add(order_product)

        payment = Payment(
            order=order,
            amount_sats=subtotal,
            status="pending",
            # provider="lnd"
        )
        db.session.add(payment)
        db.session.flush()  # Needed to get payment.id

        txn = Transaction(
            payment=payment,
            event_type="invoice-generated",
            transaction_metadata="{'source': 'buy_now'}"
        )
        db.session.add(txn)

        db.session.commit()

        # Create Lightning invoice with LND
        # lnd_service = LNDService()
        # invoice = lnd_service.create_invoice(
        #     amount=subtotal,
        #     memo=f"Buy Now Order #{order.id}",
        #     order_id=order.id
        # )

        return {
            "payment_request": invoice["payment_request"],
            "payment_hash": invoice["payment_hash"],
            "payment_id": invoice["payment_id"],
            "amount_sats": subtotal
        }

    except SQLAlchemyError as e:
        db.session.rollback()
        print(traceback.format_exc())
        return {"message": "Buy now failed", "error": str(e)}, 500


def checkout_complete(user_id):

    """
    Finalizes the checkout process for a user's cart.

    - Decreases product stock based on quantities in the cart.
    - Clears the user's cart after successful stock update.

    Args:
        user_id (int): ID of the user checking out.

    Returns:
        tuple: A JSON response with status code.
    """
    try:
        cart_items = Cart.query.filter_by(user_id=user_id).all()
        if not cart_items:
            return {"message": "No items to checkout."}, 400

        for item in cart_items:
            product = Product.query.get(item.product_id)
            if product:
                product.stock_quantity = max(0, product.stock_quantity - item.quantity)
            db.session.delete(item)

        db.session.commit()
        return {"message": "Checkout complete. Thank you!"}, 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return {"message": "Failed to finalize checkout", "error": str(e)}, 500