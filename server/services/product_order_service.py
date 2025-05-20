import logging
from models.product_order import ProductOrder
from models.db import db
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)

def get_product_order(product_order_id):
    try:
        po = ProductOrder.query.get_or_404(product_order_id)
        return po.to_dict()
    except Exception as e:
        logger.error(f"Error fetching product_order {product_order_id}: {e}")
        raise

def delete_product_order(product_order_id):
    try:
        po = ProductOrder.query.get_or_404(product_order_id)
        db.session.delete(po)
        db.session.commit()
        return {"message": "ProductOrder deleted"}, 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to delete product_order {product_order_id}: {e}")
        return {"message": "Failed to delete ProductOrder"}, 500

def update_product_order(product_order_id, data):
    try:
        po = ProductOrder.query.get_or_404(product_order_id)
        for key, value in data.items():
            if hasattr(po, key) and value is not None:
                setattr(po, key, value)
        db.session.commit()
        return po.to_dict(), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to update product_order {product_order_id}: {e}")
        return {"message": "Failed to update ProductOrder"}, 500

def get_all_product_orders():
    try:
        pos = ProductOrder.query.all()
        return [p.to_dict() for p in pos]
    except Exception as e:
        logger.error(f"Error fetching all product_orders: {e}")
        return {"message": "Failed to fetch product_orders"}, 500

def create_product_order(data):
    try:
        po = ProductOrder(**data)
        db.session.add(po)
        db.session.commit()
        return po.to_dict(), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to create product_order: {e}")
        return {"message": "Failed to create ProductOrder"}, 500
