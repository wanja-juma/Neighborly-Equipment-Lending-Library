from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.extensions import db
from models.loans import Loan
from schemas.loans_schema import (
    loan_schema,
    loans_schema,
)


loans_bp = Blueprint(
    "loans",
    __name__,
    url_prefix="/api/loans",
)


@loans_bp.get("")
@jwt_required()
def get_loans():
    """Get all loans."""

    loans = Loan.query.all()

    return jsonify(
        {
            "loans": loans_schema.dump(
                loans
            )
        }
    ), 200


@loans_bp.post("")
@jwt_required()
def create_loan():
    """Create a new loan."""

    json_data = request.get_json(
        silent=True
    )

    if not json_data:
        return jsonify(
            {
                "error": (
                    "Request body is required."
                )
            }
        ), 400

    try:
        loan = loan_schema.load(
            json_data,
            session=db.session,
        )

        db.session.add(loan)
        db.session.commit()

        return jsonify(
            {
                "loan": loan_schema.dump(
                    loan
                )
            }
        ), 201

    except ValidationError as error:
        db.session.rollback()

        return jsonify(
            {
                "error": (
                    "Validation failed."
                ),
                "details":
                    error.messages,
            }
        ), 400


@loans_bp.get("/<int:loan_id>")
@jwt_required()
def get_loan(loan_id):
    """Get a specific loan by ID."""

    loan = db.session.get(
        Loan,
        loan_id,
    )

    if loan is None:
        return jsonify(
            {
                "error": (
                    "Loan record not found."
                )
            }
        ), 404

    return jsonify(
        {
            "loan":
                loan_schema.dump(
                    loan
                )
        }
    ), 200


@loans_bp.patch(
    "/<int:loan_id>"
)
@jwt_required()
def update_loan(loan_id):
    """Update a specific loan."""

    loan = db.session.get(
        Loan,
        loan_id,
    )

    if loan is None:
        return jsonify(
            {
                "error": (
                    "Loan record not found."
                )
            }
        ), 404

    json_data = request.get_json(
        silent=True
    )

    if not json_data:
        return jsonify(
            {
                "error": (
                    "Request body is required."
                )
            }
        ), 400

    try:
        updated_loan = (
            loan_schema.load(
                json_data,
                instance=loan,
                session=db.session,
                partial=True,
            )
        )

        db.session.commit()

        return jsonify(
            {
                "loan":
                    loan_schema.dump(
                        updated_loan
                    )
            }
        ), 200

    except ValidationError as error:
        db.session.rollback()

        return jsonify(
            {
                "error": (
                    "Validation failed."
                ),
                "details":
                    error.messages,
            }
        ), 400


@loans_bp.delete(
    "/<int:loan_id>"
)
@jwt_required()
def delete_loan(loan_id):
    """Delete a specific loan."""

    loan = db.session.get(
        Loan,
        loan_id,
    )

    if loan is None:
        return jsonify(
            {
                "error": (
                    "Loan record not found."
                )
            }
        ), 404

    db.session.delete(loan)
    db.session.commit()

    return jsonify(
        {
            "message": (
                "Loan deleted successfully."
            )
        }
    ), 200
    return jsonify({"message": "Loan deleted successfully"}), 200

