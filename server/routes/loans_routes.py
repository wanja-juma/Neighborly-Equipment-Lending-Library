<<<<<<< HEAD
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.extensions import db
from models.loans import Loan
from schemas.loans_schema import loan_schema, loans_schema

loans_bp = Blueprint("loans", __name__, url_prefix="/api/loans")


@loans_bp.get("")
@jwt_required()
def get_loans():
    """Get all loans."""
    loans = Loan.query.all()
    return jsonify({"loans": loans_schema.dump(loans)}), 200


@loans_bp.post("")
@jwt_required()
def create_loan():
    """Create a new loan."""
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    try:
        loan = loan_schema.load(json_data, session=db.session)
        db.session.add(loan)
        db.session.commit()
        return jsonify({"loan": loan_schema.dump(loan)}), 201

    except ValidationError as error:
        db.session.rollback()
        return jsonify({
            "error": "Validation failed.",
            "details": error.messages
        }), 400


@loans_bp.get("/<int:loan_id>")
@jwt_required()
def get_loan(loan_id):
    """Get a specific loan by ID."""
    loan = db.session.get(Loan, loan_id)
    if loan is None:
        return jsonify({"error": "Loan record not found."}), 404

    return jsonify({"loan": loan_schema.dump(loan)}), 200


@loans_bp.patch("/<int:loan_id>")
@jwt_required()
def update_loan(loan_id):
    """Update a specific loan."""
    loan = db.session.get(Loan, loan_id)
    if loan is None:
        return jsonify({"error": "Loan record not found."}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    try:
        updated_loan = loan_schema.load(
            json_data,
            instance=loan,
            session=db.session,
            partial=True
        )
        db.session.commit()
        return jsonify({"loan": loan_schema.dump(updated_loan)}), 200

    except ValidationError as error:
        db.session.rollback()
        return jsonify({
            "error": "Validation failed.",
            "details": error.messages
        }), 400


@loans_bp.delete("/<int:loan_id>")
@jwt_required()
def delete_loan(loan_id):
    """Delete a specific loan."""
    loan = db.session.get(Loan, loan_id)
    if loan is None:
        return jsonify({"error": "Loan record not found."}), 404

    db.session.delete(loan)
    db.session.commit()

    return jsonify({"message": "Loan deleted successfully"}), 200
=======
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
>>>>>>> c908ca16fc20350a2907b14a72c51bce2d7136f6
