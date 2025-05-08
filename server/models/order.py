from models.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Order(db.Model, SerializerMixin):
    """
    Represents a customer's purchase request.

    Attributes:
        id (int): Primary key.
        buyer_id (int): Foreign key to the User who placed the order.
        status (str): Status of the order (e.g., 'pending', 'completed').
        created_at (datetime): Timestamp when the order was created.

    Relationships:
        buyer (User): The user who placed the order.
        escrow (Escrow): Escrow record for this order (one-to-one).
        payments (List[Payment]): List of payments related to the order.
        order_details (List[OrderDetail]): Detailed list of products in the order.
    """
    __tablename__ = 'orders'

    serialize_rules = ('-buyer.orders','-order_details.order')

    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.String(50))
    # created_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    buyer = db.relationship('User', back_populates='orders')
    escrow = db.relationship('Escrow', back_populates='order', uselist=False, cascade="all, delete-orphan")
    payments = db.relationship('Payment', back_populates='order', cascade="all, delete-orphan")
    order_details = db.relationship('OrderDetail', back_populates='order', cascade="all, delete-orphan")