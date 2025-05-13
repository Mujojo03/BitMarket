from models.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Payment(db.Model, SerializerMixin):
    """
    Represents a payment made for an order, typically via the Lightning Network.

    Attributes:
        id (int): Primary key.
        order_id (int): Foreign key referencing the associated Order.
        payment_hash (str): Unique hash to track the LN payment.
        payment_preimage (str): Proof that the payment was settled.
        invoice (str): Lightning invoice string for the payment.
        provider (str): Payment provider (e.g. 'lnd', 'lnbits').
        status (str): Status of the payment (e.g., 'pending', 'settled').
        amount_sats (BigInteger): Amount paid in satoshis.
        paid_at (datetime): Timestamp when payment was completed.

    Relationships:
        order (Order): The order this payment belongs to.
        transactions (List[Transaction]): List of transaction events for this payment.
    """
    __tablename__ = 'payments'

    serialize_rules = ('-order.payments','-transactions.payment')

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    payment_hash = db.Column(db.String(255))
    payment_preimage = db.Column(db.String(255))
    invoice = db.Column(db.Text)
    provider = db.Column(db.String(100))
    status = db.Column(db.String(50))
    amount_sats = db.Column(db.BigInteger)
    paid_at = db.Column(db.DateTime)

    order = db.relationship('Order', back_populates='payments')
    transactions = db.relationship('Transaction', back_populates='payment', cascade="all, delete-orphan")
