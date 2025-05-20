# services/wallet_service.py
from models.wallet import Wallet
from models.db import db
from sqlalchemy.exc import SQLAlchemyError

def get_wallet(wallet_id):
    wallet = Wallet.query.get_or_404(wallet_id)
    return wallet.to_dict()

def delete_wallet(wallet_id):
    wallet = Wallet.query.get_or_404(wallet_id)
    try:
        db.session.delete(wallet)
        db.session.commit()
        return {"message": "Wallet deleted"}, 200
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to delete wallet"}, 500

def update_wallet(wallet_id, data):
    wallet = Wallet.query.get_or_404(wallet_id)
    for key, value in data.items():
        if hasattr(wallet, key) and value is not None:
            setattr(wallet, key, value)
    try:
        db.session.commit()
        return wallet.to_dict(), 200
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to update wallet"}, 500

def get_all_wallets():
    wallets = Wallet.query.all()
    return [w.to_dict() for w in wallets]

def create_wallet(data):
    wallet = Wallet(**data)
    try:
        db.session.add(wallet)
        db.session.commit()
        return wallet.to_dict(), 201
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to create wallet"}, 500
