from models.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Transaction(db.Model, SerializerMixin):
    """
    Represents an event in the payment lifecycle, useful for debugging and tracking.

    Attributes:
        id (int): Primary key.
        payment_id (int): Foreign key to the Payment.
        event_type (str): Type of event (e.g., 'invoice-generated', 'payment-settled').
        metadata (Text): Optional JSON or raw text log related to the event.
        created_at (datetime): Timestamp of the transaction event.

    Relationship:
        payment (Payment): The payment this transaction is linked to.
    """
    __tablename__ = 'transactions'

    serialize_rules = ('-payment.transactions',)

    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.id'))
    event_type = db.Column(db.String(100))  # e.g., invoice-generated, payment-sent, failed, settled
    transaction_metadata = db.Column(db.Text)  # Optional JSON log or data from LN API
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    payment = db.relationship('Payment', back_populates='transactions')
