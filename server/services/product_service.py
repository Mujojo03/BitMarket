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
        return Product.query.all()
    except Exception as e:
        raise Exception(f"Error retrieving all products: {str(e)}")

def get_product_by_id(product_id):
    try:
        return Product.query.get(product_id)
    except Exception as e:
        raise Exception(f"Error retrieving product by ID: {str(e)}")

def get_products_by_category(category_id):
    try:
        return Product.query.filter_by(category_id=category_id).all()
    except Exception as e:
        raise Exception(f"Error retrieving products by category: {str(e)}")

