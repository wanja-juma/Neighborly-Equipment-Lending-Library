from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from models import Loan, Payment
from models.borrow_request import BorrowingRequest
from schemas import PaymentSchema


payment_bp = Blueprint(
    "payments",
    __name__,
    url_prefix="/api/payments",
)


payment_schema = PaymentSchema()


def _get_current_user_id():
    identity = get_jwt_identity()

    try:
        return int(identity)
    except (TypeError, ValueError):
        return None


def _is_authorized_for_loan(loan, user_id):
    if loan is None:
        return False

    if loan.borrower_id == user_id:
        return True

    if loan.item and loan.item.owner_id == user_id:
        return True

    return False


def _get_approved_request(loan_id, borrower_id):
    return (
        BorrowingRequest.query
        .filter(
            BorrowingRequest.loan_id == loan_id,
            BorrowingRequest.user_id == borrower_id,
            db.func.lower(BorrowingRequest.status) == "approved",
        )
        .first()
    )


@payment_bp.get("/<int:payment_id>")
@jwt_required()
def get_payment(payment_id):
    payment = db.session.get(Payment, payment_id)

    if payment is None:
        return jsonify({"error": "Payment not found."}), 404

    current_user_id = _get_current_user_id()

    if current_user_id is None:
        return jsonify({"error": "Invalid authenticated user."}), 401

    loan = db.session.get(Loan, payment.loan_id)

    if not _is_authorized_for_loan(loan, current_user_id):
        return jsonify({"error": "You are not authorized to view this payment."}), 403

<<<<<<< HEAD
    return jsonify({
        "payment":
            payment_schema.dump(
                payment
            )
    }), 200

   
=======
    return jsonify({"payment": payment_schema.dump(payment)}), 200
>>>>>>> 0eb4de73f94a5095eddf991849fed584dc3fd202


@payment_bp.post("")
@jwt_required()
def create_payment():
    json_data = request.get_json(silent=True)

    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    current_user_id = _get_current_user_id()

    if current_user_id is None:
        return jsonify({"error": "Invalid authenticated user."}), 401

    loan_id = json_data.get("loan_id")

    if loan_id is None:
        return jsonify({"error": "loan_id is required."}), 400

    try:
        loan_id = int(loan_id)
    except (TypeError, ValueError):
        return jsonify({"error": "loan_id must be a valid integer."}), 400

    loan = db.session.get(Loan, loan_id)

    if loan is None:
        return jsonify({"error": "Loan not found."}), 404

    # Only the borrower may create the deposit payment.
    if loan.borrower_id != current_user_id:
        return jsonify({"error": "Only the borrower can create a payment for this loan."}), 403

    # The loan must be linked to an approved borrowing request.
    approved_request = _get_approved_request(loan.id, current_user_id)

    if approved_request is None:
        return jsonify({"error": "Payment is only allowed for an approved borrowing request."}), 403

    # One payment per loan.
    existing_payment = Payment.query.filter_by(loan_id=loan.id).first()

    if existing_payment:
        return jsonify({
            "error": "A payment already exists for this loan.",
            "payment": payment_schema.dump(existing_payment),
        }), 409

    amount = json_data.get("amount")

    if amount is None:
        return jsonify({"error": "Payment amount is required."}), 400

    # Build the payload ourselves. Do not trust status or timestamps
    # supplied by the frontend.
    payment_data = {
        "loan_id": loan.id,
        "amount": amount,
        "status": "held",
    }

    try:
        payment = payment_schema.load(payment_data, session=db.session)
        payment.paid_at = db.func.now()
        db.session.add(payment)
        db.session.commit()

    except ValidationError as error:
        db.session.rollback()
        return jsonify({"error": "Validation failed.", "details": error.messages}), 400

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A payment already exists for this loan."}), 409

    except ValueError as error:
        db.session.rollback()
        return jsonify({"error": str(error)}), 400

    return jsonify({"payment": payment_schema.dump(payment)}), 201


@payment_bp.patch("/<int:payment_id>/refund")
@jwt_required()
def refund_payment(payment_id):
    payment = db.session.get(Payment, payment_id)

    if payment is None:
        return jsonify({"error": "Payment not found."}), 404

    current_user_id = _get_current_user_id()

    if current_user_id is None:
        return jsonify({"error": "Invalid authenticated user."}), 401

    loan = db.session.get(Loan, payment.loan_id)

    # Refunds can only be issued by the item's owner.
    if not (loan and loan.item and loan.item.owner_id == current_user_id):
        return jsonify({"error": "Only the item's owner can issue a refund."}), 403

    if payment.status == "refunded":
        return jsonify({"error": "This payment has already been refunded."}), 409

    payment.status = "refunded"
    payment.refunded_at = db.func.now()
    db.session.commit()

    return jsonify({"payment": payment_schema.dump(payment)}), 200