from models.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Cart(db.Model, SerializerMixin):
    """
    Represents a shopping cart item for a user.

    Each entry in the cart corresponds to a specific product the user intends to purchase,
    including quantity and the time it was added.

    Attributes:
        id (int): Primary key.
        user_id (int): Foreign key to the User who owns this cart.
        product_id (int): Foreign key to the Product added to the cart.
        quantity (int): Number of units of the product.
        added_at (datetime): Timestamp when the product was added to the cart.

    Relationships:
        user (User): The user who owns this cart item.
    """   

    __tablename__ = 'carts'

    serialize_rules = ('-user.carts', '-product.carts',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='carts')
    product = db.relationship('Product', back_populates='carts')
    