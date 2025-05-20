# services/transaction_service.py
from models.transaction import Transaction
from models.db import db
from sqlalchemy.exc import SQLAlchemyError

def get_transaction(transaction_id):
    txn = Transaction.query.get_or_404(transaction_id)
    return txn.to_dict()

def delete_transaction(transaction_id):
    txn = Transaction.query.get_or_404(transaction_id)
    try:
        db.session.delete(txn)
        db.session.commit()
        return {"message": "Transaction deleted"}, 200
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to delete transaction"}, 500

def update_transaction(transaction_id, data):
    txn = Transaction.query.get_or_404(transaction_id)
    for key, value in data.items():
        if hasattr(txn, key) and value is not None:
            setattr(txn, key, value)
    try:
        db.session.commit()
        return txn.to_dict(), 200
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to update transaction"}, 500

def get_all_transactions():
    txns = Transaction.query.all()
    return [t.to_dict() for t in txns]

def create_transaction(data):
    txn = Transaction(**data)
    try:
        db.session.add(txn)
        db.session.commit()
        return txn.to_dict(), 201
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to create transaction"}, 500
