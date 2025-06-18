import logging
from server.models.order import Order
from server.models import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import get_jwt_identity

logger = logging.getLogger(__name__)

def get_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        return order.to_dict()
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
        return order.to_dict(), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to update order {order_id}: {e}")
        return {"message": "Failed to update order"}, 500

def get_all_orders():
    try:
        # Get current user ID from JWT
        user_id = get_jwt_identity()
        
        # Filter orders by current user
        orders = Order.query.filter_by(buyer_id=user_id).all()
        return [o.to_dict() for o in orders]
    except Exception as e:
        logger.error(f"Error fetching all orders: {e}")
        return {"message": "Failed to fetch orders"}, 500


def create_order(data):
    try:
        order = Order(**data)
        db.session.add(order)
        db.session.commit()
        return order.to_dict(), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to create order: {e}")
        return {"message": "Failed to create order"}, 500
