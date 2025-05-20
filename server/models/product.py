from models.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Product(db.Model, SerializerMixin):
    """
    Product model represents items listed by sellers. Includes metadata, pricing, and inventory.

    Attributes:
        id (int): Primary key.
        seller_id (int): Foreign key to the User.
        category_id (int): Foreign key to the Category.
        name (str): Product name.
        description (str): Description of the product.
        price_sats (int): Price in satoshis.
        img_url (str): Image URL.
        stock_quantity (int): Inventory count.
        created_at (datetime): Timestamp when product was added.

    Relationships:
        seller: User who listed the product.
        category: The product's category.
        carts: Carts that contain the product.
        product_orders: Orders that include this product.
    """
    __tablename__ = 'products'

    serialize_rules = ('-seller.products', '-carts', '-category.products')

    id = db.Column(db.Integer, primary_key=True, index=True)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    price_sats = db.Column(db.BigInteger)
    img_url = db.Column(db.String(255))
    stock_quantity = db.Column(db.Integer)
    created_at = db.Column(db.DateTime)
    deleted = db.Column(db.Boolean, default=False, nullable=False)

    seller = db.relationship('User', back_populates='products')
    category = db.relationship('Category', back_populates='products')
    carts = db.relationship('Cart', back_populates='product', cascade="all, delete-orphan")
    product_orders = db.relationship('ProductOrder', back_populates='product', cascade="all, delete-orphan")
