from models.db import db
from sqlalchemy_serializer import SerializerMixin


class Escrow(db.Model, SerializerMixin):
    """
    Holds funds temporarily for an order until the conditions are fulfilled (e.g. delivery confirmed).

    Attributes:
        id (int): Primary key.
        order_id (int): Foreign key to the related Order.
        is_released (bool): Indicates if funds have been released to the seller.
        released_at (datetime): Timestamp when escrow was released.
        dispute_status (str): Tracks any disputes (e.g., 'open', 'resolved').

    Relationship:
        order (Order): The order associated with this escrow record.
    """
    __tablename__ = 'escrows'

    serialize_rules = ('-order.escrow',)

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    is_released = db.Column(db.Boolean, default=False)
    released_at = db.Column(db.DateTime)
    dispute_status = db.Column(db.String(50))

    order = db.relationship('Order', back_populates='escrow')
