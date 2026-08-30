from datetime import datetime
from flask import Blueprint, jsonify, request
from app.extensions import db
from models.loans import Loan
from schemas.loans_schema import loan_schema, loans_schema
from marshmallow import ValidationError

loans_bp = Blueprint("loans_bp", __name__, url_prefix="/api/loans")


@loans_bp.route("", methods=["GET"])
def get_loans():
    """Get all loans."""
    loans = Loan.query.all()
    return jsonify(loans_schema.dump(loans)), 200


@loans_bp.route("/<int:loan_id>", methods=["GET"])
def get_loan(loan_id):
    """Get a single loan by ID."""
    loan = Loan.query.get_or_404(loan_id)
    return jsonify(loan_schema.dump(loan)), 200


@loans_bp.route("", methods=["POST"])
def create_loan():
    """Create a new loan request."""
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        
        data = loan_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    new_loan = Loan(
        item_id=data["item_id"],
        borrower_id=data["borrower_id"],
        status=data.get("status", "pending"),
        start_date=data.get("start_date"),
        due_date=data.get("due_date"),
    )

    db.session.add(new_loan)
    db.session.commit()

    return jsonify(loan_schema.dump(new_loan)), 201


@loans_bp.route("/<int:loan_id>", methods=["PATCH"])
def update_loan(loan_id):
    """Update loan details or status (e.g., approval, return date)."""
    loan = Loan.query.get_or_404(loan_id)
    json_data = request.get_json()

    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        data = loan_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 422

    for key, value in data.items():
        setattr(loan, key, value)

    
    if "status" in data:
        if data["status"] == "approved" and not loan.approved_at:
            loan.approved_at = datetime.utcnow()
        elif data["status"] == "returned" and not loan.returned_at:
            loan.returned_at = datetime.utcnow()

    db.session.commit()
    return jsonify(loan_schema.dump(loan)), 200


@loans_bp.route("/<int:loan_id>", methods=["DELETE"])
def delete_loan(loan_id):
    """Delete a loan record."""
    loan = Loan.query.get_or_404(loan_id)
    db.session.delete(loan)
    db.session.commit()
    return jsonify({"message": "Loan deleted successfully"}), 200