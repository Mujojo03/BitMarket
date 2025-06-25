import datetime
from models import Product, db

def create_product(seller_id, category_id, name, description, price_sats, img_url, stock_quantity):
    try:
        product = Product(
            seller_id=seller_id,
            category_id=category_id,
            name=name,
            description=description,
            price_sats=price_sats,
            img_url=img_url,
            stock_quantity=stock_quantity,
            created_at=datetime.datetime.now(datetime.timezone.utc)
        )
        db.session.add(product)
        db.session.commit()
        return product
    except Exception as e:
        raise Exception(f"Error creating product: {str(e)}")

def get_all_products():
    try:
        return Product.query.filter_by(deleted=False).all()
    except Exception as e:
        raise Exception(f"Error retrieving all products: {str(e)}")

def get_product_by_id(product_id):
    try:
        return Product.query.filter_by(id=product_id, deleted=False).first()
    except Exception as e:
        raise Exception(f"Error retrieving product by ID: {str(e)}")

def get_products_by_category(category_id):
    try:
        return Product.query.filter_by(category_id=category_id, deleted=False).all()
    except Exception as e:
        raise Exception(f"Error retrieving products by category: {str(e)}")

def get_products_by_seller(seller_id):
    try:
        return Product.query.filter_by(seller_id=seller_id, deleted=False).all()
    except Exception as e:
        raise Exception(f"Error retrieving products by seller: {str(e)}")

def update_product(product_id, updates):
    try:
        product = Product.query.filter_by(id=product_id, deleted=False).first()
        if not product:
            return None

        for key, value in updates.items():
            if hasattr(product, key):
                setattr(product, key, value)

        db.session.commit()
        return product
    except Exception as e:
        raise Exception(f"Error updating product: {str(e)}")

def delete_product(product_id):
    try:
        product = Product.query.filter_by(id=product_id, deleted=False).first()
        if not product:
            return None

        product.deleted = True
        db.session.commit()
        return True
    except Exception as e:
        raise Exception(f"Error deleting product: {str(e)}")
