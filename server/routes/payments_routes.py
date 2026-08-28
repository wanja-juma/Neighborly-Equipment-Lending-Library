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


@payment_bp.get("/<int:payment_id>")
@jwt_required()
def get_payment(payment_id):
    payment = db.session.get(Payment, payment_id)

    if payment is None:
        return jsonify({"error": "Payment not found."}), 404

    current_user_id = int(get_jwt_identity())
    loan = db.session.get(Loan, payment.loan_id)
    if not _is_authorized_for_loan(loan, current_user_id):
        return jsonify({"error": "You are not authorized to view this payment."}), 403

    return jsonify({"payment": payment_schema.dump(payment)}), 200


@payment_bp.post("")
@jwt_required()
def create_payment():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    current_user_id = int(get_jwt_identity())
    loan = db.session.get(Loan, json_data.get("loan_id"))
    if not _is_authorized_for_loan(loan, current_user_id):
        return jsonify({"error": "You are not authorized to create a payment for this loan."}), 403

    try:
        payment = payment_schema.load(json_data, session=db.session)
    except ValidationError as error:
        return jsonify({"error": "Validation failed.", "details": error.messages}), 400

    db.session.add(payment)
    db.session.commit()

    return jsonify({"payment": payment_schema.dump(payment)}), 201


@payment_bp.patch("/<int:payment_id>/refund")
@jwt_required()
def refund_payment(payment_id):
    payment = db.session.get(Payment, payment_id)

    if payment is None:
        return jsonify({"error": "Payment not found."}), 404

    current_user_id = int(get_jwt_identity())
    loan = db.session.get(Loan, payment.loan_id)
    # Refunding is an owner action, not a borrower one.
    if not (loan and loan.item and loan.item.owner_id == current_user_id):
        return jsonify({"error": "Only the item's owner can issue a refund."}), 403

    payment.status = "refunded"
    payment.refunded_at = db.func.now()
    db.session.commit()

    return jsonify({"payment": payment_schema.dump(payment)}), 200
    