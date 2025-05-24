import logging
from models.product_order import ProductOrder
from models.db import db
from models.product import Product
from sqlalchemy.exc import SQLAlchemyError

logger = logging.getLogger(__name__)

def serialize_product_order(po):
    """Custom serialization to avoid recursive loops and include useful product info."""
    return {
        "id": po.id,
        "order_id": po.order_id,
        "product_id": po.product_id,
        "quantity": po.quantity,
        "subtotal": po.subtotal,
        "status": po.status,
        "product": {
            "id": po.product.id,
            "name": po.product.name,
            "price": po.product.price_sats
        } if po.product else None
    }


def get_product_order(product_order_id):
    try:
        po = ProductOrder.query.get_or_404(product_order_id)
        return serialize_product_order(po)

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

        # Make sure product is loaded in case product_id changed
        if 'product_id' in data:
            po.product = Product.query.get(po.product_id)

        po.calculate_subtotal()  # recalc subtotal after updates

        db.session.commit()
        return serialize_product_order(po), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to update product_order {product_order_id}: {e}")
        return {"message": "Failed to update ProductOrder"}, 500



def get_all_product_orders():
    try:
        pos = ProductOrder.query.all()
        return {"product_orders": [serialize_product_order(p) for p in pos]}, 200


    except Exception as e:
        logger.error(f"Error fetching all product_orders: {e}")
        return {"message": "Failed to fetch product_orders"}, 500
    
def create_product_order(data):
    try:
        # Ensure product_id is present
        product_id = data.get('product_id')
        if not product_id:
            return {"message": "product_id is required"}, 400

        # Ensure product_id is valid
        product = Product.query.get(product_id)
        if not product:
            return {"message": "Invalid product_id"}, 400

        # Create ProductOrder instance
        po = ProductOrder(**data)
        po.product = product  # Assign the product object explicitly

        # Calculate subtotal before saving
        po.calculate_subtotal()

        db.session.add(po)
        db.session.commit()
        return serialize_product_order(po), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Failed to create product_order: {e}")
        return {"message": "Failed to create ProductOrder"}, 500



