# services/payment_service.py
from models.payment import Payment
from models.db import db
from sqlalchemy.exc import SQLAlchemyError

def get_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    return payment.to_dict()

def delete_payment(payment_id):
    payment = Payment.query.get_or_404(payment_id)
    try:
        db.session.delete(payment)
        db.session.commit()
        return {"message": "Payment deleted"}, 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return {"message": "Failed to delete payment"}, 500

def update_payment(payment_id, data):
    payment = Payment.query.get_or_404(payment_id)
    for key, value in data.items():
        if hasattr(payment, key) and value is not None:
            setattr(payment, key, value)
    try:
        db.session.commit()
        return payment.to_dict(), 200
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to update payment"}, 500

def get_all_payments():
    payments = Payment.query.all()
    return [p.to_dict() for p in payments]

def create_payment(data):
    payment = Payment(**data)
    try:
        db.session.add(payment)
        db.session.commit()
        return payment.to_dict(), 201
    except SQLAlchemyError:
        db.session.rollback()
        return {"message": "Failed to create payment"}, 500
