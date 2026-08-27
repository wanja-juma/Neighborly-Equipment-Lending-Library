from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError
 
from app.extensions import db
from models import Loan, Payment
from schemas import PaymentSchema
 
payment_bp = Blueprint(
    "payments",
    __name__,
    url_prefix="/api/payments",
)
 
payment_schema = PaymentSchema()


def _is_authorized_for_loan(loan, user_id):
    """Either the borrower or the item's owner may access a payment on this loan."""
    if loan is None:
        return False
    if loan.borrower_id == user_id:
        return True
    if loan.item and loan.item.owner_id == user_id:
        return True
    return False
    