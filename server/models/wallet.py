from models.db import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class Wallet(db.Model, SerializerMixin):
    """
    Wallet model represents a Bitcoin Lightning or other crypto wallet
    associated with a specific user.

    Attributes:
        id (int): Primary key.
        user_id (int): Foreign key to the user who owns the wallet.
        wallet_type (str): Type of wallet (e.g., 'lightning', 'on-chain').
        qr_code_data (str): Optional QR code text data for receiving payments.
        wallet_address (str): Public address for receiving funds, must be unique.
        created_at (datetime): Timestamp when the wallet was created.

    Relationships:
        user: Back reference to the owning User.
    """

    __tablename__ = 'wallets'

    serialize_rules = ('-user.wallets',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    wallet_type = db.Column(db.String(50))
    qr_code_data = db.Column(db.Text)
    wallet_address = db.Column(db.String(255),unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='wallets')
