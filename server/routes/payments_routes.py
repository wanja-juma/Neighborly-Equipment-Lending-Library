from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Api, Resource
from marshmallow import ValidationError

from app.extensions import db
from models import Loan, Payment
from schemas import PaymentSchema

payment_bp = Blueprint(
    "payments",
    __name__,
    url_prefix="/api/payments",
)
api = Api(payment_bp)

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


class PaymentListResource(Resource):
    method_decorators = [jwt_required()]

    def post(self):
        json_data = request.get_json(silent=True)
        if not json_data:
            return {"error": "Request body is required."}, 400

        current_user_id = int(get_jwt_identity())
        loan = db.session.get(Loan, json_data.get("loan_id"))
        if not _is_authorized_for_loan(loan, current_user_id):
            return {"error": "You are not authorized to create a payment for this loan."}, 403

        try:
            payment = payment_schema.load(json_data, session=db.session)
        except ValidationError as error:
            return {"error": "Validation failed.", "details": error.messages}, 400
        except ValueError as error:
            return {"error": str(error)}, 400

        db.session.add(payment)
        db.session.commit()

        return {"payment": payment_schema.dump(payment)}, 201


class PaymentResource(Resource):
    method_decorators = [jwt_required()]

    def get(self, payment_id):
        payment = db.session.get(Payment, payment_id)

        if payment is None:
            return {"error": "Payment not found."}, 404

        current_user_id = int(get_jwt_identity())
        loan = db.session.get(Loan, payment.loan_id)
        if not _is_authorized_for_loan(loan, current_user_id):
            return {"error": "You are not authorized to view this payment."}, 403

        return {"payment": payment_schema.dump(payment)}, 200


class PaymentRefundResource(Resource):
    method_decorators = [jwt_required()]

    def patch(self, payment_id):
        payment = db.session.get(Payment, payment_id)

        if payment is None:
            return {"error": "Payment not found."}, 404

        current_user_id = int(get_jwt_identity())
        loan = db.session.get(Loan, payment.loan_id)
        if not (loan and loan.item and loan.item.owner_id == current_user_id):
            return {"error": "Only the item's owner can issue a refund."}, 403

        payment.status = "refunded"
        payment.refunded_at = db.func.now()
        db.session.commit()

        return {"payment": payment_schema.dump(payment)}, 200


api.add_resource(PaymentListResource, "")
api.add_resource(PaymentResource, "/<int:payment_id>")
api.add_resource(PaymentRefundResource, "/<int:payment_id>/refund")