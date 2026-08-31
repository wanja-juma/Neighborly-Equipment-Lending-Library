from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.extensions import db
from models.borrow_request import BorrowingRequest
from schemas.borrow_request_schema import (
    borrowing_request_schema,
    borrowing_requests_schema
)

borrow_requests_bp = Blueprint(
    "borrow_requests", 
    __name__, 
    url_prefix="/api/borrowing-requests"
)


@borrow_requests_bp.get("")
@jwt_required()
def get_borrowing_requests():
    """Get all borrowing requests."""
    requests = BorrowRequest.query.all()
    return jsonify({
        "borrowing_requests": borrowing_requests_schema.dump(requests)
    }), 200


@borrow_requests_bp.route('/borrowing_requests', methods=['POST'])
@jwt_required()
def create_borrowing_request():
    json_data = request.get_json()

    # Ensure loan_id exists or fetch/create corresponding loan
    if 'loan_id' not in json_data or json_data['loan_id'] is None:
        return jsonify({"error": "loan_id is required"}), 400

    borrowing_request = borrowing_request_schema.load(
        json_data,
        session=db.session
    )
    db.session.add(borrowing_request)
    db.session.commit()

    return jsonify({"borrowing_request": borrowing_request_schema.dump(borrowing_request)}), 201


@borrow_requests_bp.get("/borrowing_requests/<int:request_id>")
@jwt_required()
def get_borrowing_request(request_id):
    """Get a specific borrowing request."""
    borrowing_request = db.session.get(BorrowingRequest, request_id)
    if borrowing_request is None:
        return jsonify({"error": "Borrowing request not found."}), 404

    return jsonify({
        "borrowing_request": borrowing_request_schema.dump(
            borrowing_request
        )
    }), 200


@borrow_requests_bp.patch("/borrowing_requests/<int:request_id>")
@jwt_required()
def update_borrowing_request(request_id):
    """Update a specific borrowing request."""
    borrowing_request = db.session.get(BorrowingRequest, request_id)
    if borrowing_request is None:
        return jsonify({"error": "Borrowing request not found."}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    try:
        updated_request = borrowing_request_schema.load(
            json_data,
            instance=borrowing_request,
            partial=True,
            session=db.session
        )
        db.session.commit()

        return jsonify({
            "borrowing_request": borrowing_request_schema.dump(
                updated_request
            )
        }), 200

    except ValidationError as error:
        db.session.rollback()
        return jsonify({
            "error": "Validation failed.",
            "details": error.messages
        }), 400


