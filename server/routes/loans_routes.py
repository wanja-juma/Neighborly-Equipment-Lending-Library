from flask import Blueprint, request
from flask_restful import Api, Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from models import Loan
from schemas.loans_schemas import (
    loan_schema,
    loans_schema,
)


loan_bp = Blueprint(
    "loans",
    __name__,
    url_prefix="/api/loans",
)

loan_api = Api(loan_bp)


class LoanListResource(Resource):
    def get(self):
        loans = Loan.query.all()

        return loans_schema.dump(loans), 200

    def post(self):
        json_data = request.get_json(
            silent=True
        )

        if not json_data:
            return {
                "error": (
                    "Request body is required."
                )
            }, 400

        try:
            new_loan = loan_schema.load(
                json_data,
                session=db.session,
            )

            db.session.add(new_loan)
            db.session.commit()

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400

        except IntegrityError:
            db.session.rollback()

            return {
                "error": (
                    "The loan could not be "
                    "created."
                )
            }, 409

        return loan_schema.dump(new_loan), 201


class LoanResource(Resource):
    def get(self, loan_id):
        loan = db.session.get(
            Loan,
            loan_id,
        )

        if loan is None:
            return {
                "error": "Loan not found."
            }, 404

        return loan_schema.dump(loan), 200

    def patch(self, loan_id):
        loan = db.session.get(
            Loan,
            loan_id,
        )

        if loan is None:
            return {
                "error": "Loan not found."
            }, 404

        json_data = request.get_json(
            silent=True
        )

        if not json_data:
            return {
                "error": (
                    "Request body is required."
                )
            }, 400

        try:
            updated_loan = loan_schema.load(
                json_data,
                instance=loan,
                partial=True,
                session=db.session,
            )

            db.session.add(updated_loan)
            db.session.commit()

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400

        except IntegrityError:
            db.session.rollback()

            return {
                "error": (
                    "The loan could not be "
                    "updated."
                )
            }, 409

        return (
            loan_schema.dump(updated_loan),
            200,
        )

    def delete(self, loan_id):
        loan = db.session.get(
            Loan,
            loan_id,
        )

        if loan is None:
            return {
                "error": "Loan not found."
            }, 404

        db.session.delete(loan)
        db.session.commit()

        return {
            "message": (
                "Loan deleted successfully."
            )
        }, 200


loan_api.add_resource(
    LoanListResource,
    "",
    "/",
)

loan_api.add_resource(
    LoanResource,
    "/<int:loan_id>",
)