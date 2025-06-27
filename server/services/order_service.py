import logging
from models.order import Order
from models.db import db
from sqlalchemy.exc import SQLAlchemyError
from models.product import Product
from models.product_order import ProductOrder

logger = logging.getLogger(__name__)

def get_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)

        order_data = {
            "order_id": order.id,
            "buyer_id": order.buyer_id,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "products": [
                {
                    "product_id": po.product_id,
                    "product_name": po.product.name if po.product else None,
                    "product_image": po.product.img_url if po.product else None,
                    "quantity": po.quantity,
                    "subtotal": po.subtotal,
                    "status": po.status
                }
                for po in order.product_orders
            ]
        }

        return order_data

    except Exception as e:
        logger.error(f"Error fetching order {order_id}: {e}")
        raise


def delete_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return {"message": "Order deleted"}, 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to delete order {order_id}: {e}")
        return {"message": "Failed to delete order"}, 500

def update_order(order_id, data):
    try:
        order = Order.query.get_or_404(order_id)

        for key, value in data.items():
            if hasattr(order, key) and value is not None:
                setattr(order, key, value)

        db.session.commit()

        # Custom serialization to avoid recursion
        order_data = {
            "order_id": order.id,
            "buyer_id": order.buyer_id,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "products": [
                {
                    "product_id": po.product_id,
                    "product_name": po.product.name if po.product else None,
                    "product_image": po.product.img_url if po.product else None,
                    "quantity": po.quantity,
                    "subtotal": po.subtotal,
                    "status": po.status
                }
                for po in order.product_orders
            ]
        }

        return order_data, 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to update order {order_id}: {e}")
        return {"message": "Failed to update order"}, 500


def get_all_orders():
    try:
        orders = Order.query.all()

        order_list = []
        for order in orders:
            products = []
            for po in order.product_orders:
                product = po.product  # assuming relationship is set up
                products.append({
                    "product_id": po.product_id,
                    "product_name": product.name if product else None,
                    "product_image": product.img_url if product else None,
                    "quantity": po.quantity,
                    "subtotal": po.subtotal,
                    "status": po.status
                })

            order_list.append({
                "order_id": order.id,
                "buyer_id": order.buyer_id,
                "status": order.status,
                "created_at": order.created_at.isoformat() if order.created_at else None,
                "products": products
            })

        return order_list, 200

    except Exception as e:
        logger.error(f"Error fetching all orders: {e}")
        return {"message": "Failed to fetch orders"}, 500


def create_order(data):
    """
    Creates an order with given user_id and product list.
    Snapshots product price at order creation time in ProductOrder.subtotal.
    Deducts stock from products.

    data = {
        "user_id": int,
        "products": [  # List of products with quantity
            {"product_id": int, "quantity": int},
            ...
        ]
    }

    Returns order dict on success or error message with status code.
    """
    try:
        user_id = data.get("user_id")
        products = data.get("products")  # List of dicts with product_id & quantity

        if not products or not isinstance(products, list):
            return {"message": "Order must include a list of products."}, 400

        # Validate quantities and product existence upfront
        for item in products:
            product_id = item.get("product_id")
            quantity = item.get("quantity", 0)
            if quantity <= 0:
                return {"message": f"Invalid quantity for product {product_id}."}, 400

            product = Product.query.filter_by(id=product_id, deleted=False).first()
            if not product:
                return {"message": f"Product {product_id} not found."}, 404
            if product.stock_quantity < quantity:
                return {"message": f"Insufficient stock for product '{product.name}'."}, 400

        # Create order without total_amount
        order = Order(buyer_id=user_id)
        db.session.add(order)
        db.session.flush()  # To get order.id

        # Create ProductOrder lines and reduce stock
        for item in products:
            product_id = item.get("product_id")
            quantity = item.get("quantity")
            product = Product.query.get(product_id)

            subtotal = product.price_sats * quantity

            # Create ProductOrder record
            product_order = ProductOrder(
                product_id=product_id,
                order_id=order.id,
                quantity=quantity,
                subtotal=subtotal,
                status="pending"
            )
            db.session.add(product_order)

            # Deduct stock
            product.stock_quantity -= quantity

        db.session.commit()

        # ✅ SAFE CUSTOM ORDER SERIALIZATION
        order_data = {
            "order_id": order.id,
            "buyer_id": order.buyer_id,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,

            "products": [
                {
                    "product_id": po.product_id,
                    "product_name": Product.query.get(po.product_id).name,
                    "product_image": product.img_url,
                    "quantity": po.quantity,
                    "subtotal": po.subtotal,
                    "status": po.status
                }
                for po in ProductOrder.query.filter_by(order_id=order.id).all()
            ]
        }
        return order_data, 201

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to create order: {e}")
        return {"message": "Failed to create order"}, 500