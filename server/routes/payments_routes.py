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