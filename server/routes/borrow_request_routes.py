from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timezone
from marshmallow import ValidationError

from app.extensions import db
from models.borrow_request import BorrowingRequest
from models.loans import Loan
from models.item import Item  # ⚠️ confirm owner column name below
from schemas.borrow_request_schema import (
    borrowing_request_schema,
    borrowing_requests_schema
)

borrow_requests_bp = Blueprint(
    "borrow_requests", __name__, url_prefix="/api/borrowing-requests"
)


@borrow_requests_bp.post("")
@jwt_required()
def create_borrowing_request():
    current_user_id = get_jwt_identity()
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    try:
        json_data['user_id'] = current_user_id
        borrowing_request = borrowing_request_schema.load(json_data, session=db.session)
        db.session.add(borrowing_request)
        db.session.commit()
        return jsonify({"borrowing_request": borrowing_request_schema.dump(borrowing_request)}), 201
    except ValidationError as error:
        db.session.rollback()
        return jsonify({"error": "Validation failed.", "details": error.messages}), 400


@borrow_requests_bp.get("")
@jwt_required()
def get_borrowing_requests():
    current_user_id = get_jwt_identity()
    req_type = request.args.get("type", "incoming")

    if req_type == "incoming":
        # ⚠️ assumes Item.user_id is the owner column — confirm
        requests = (
            BorrowingRequest.query
            .join(Item, BorrowingRequest.equipment_id == Item.id)
            .filter(Item.owner_id == current_user_id)
            .all()
        )
    else:
        requests = BorrowingRequest.query.filter_by(user_id=current_user_id).all()

    return jsonify({"borrowing_requests": borrowing_requests_schema.dump(requests)}), 200


@borrow_requests_bp.patch("/<int:request_id>")
@jwt_required()
def update_borrowing_request(request_id):
    borrowing_request = db.session.get(BorrowingRequest, request_id)
    if not borrowing_request:
        return jsonify({"error": "Borrowing request not found."}), 404

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    try:
        updated_request = borrowing_request_schema.load(
            json_data, instance=borrowing_request, partial=True, session=db.session
        )

        if updated_request.status == "approved" and updated_request.loan_id is None:
            loan = Loan(
                item_id=updated_request.equipment_id,
                borrower_id=updated_request.user_id,
                start_date=updated_request.start_date or datetime.now(timezone.utc),
                end_date=updated_request.end_date,
                approved_at=datetime.now(timezone.utc),
                status="Active",
            )
            db.session.add(loan)
            db.session.flush()
            updated_request.loan_id = loan.id

        db.session.commit()
        return jsonify({"borrowing_request": borrowing_request_schema.dump(updated_request)}), 200
    except ValidationError as error:
        db.session.rollback()
        return jsonify({"error": "Validation failed.", "details": error.messages}), 400


@borrow_requests_bp.delete("/<int:request_id>")
@jwt_required()
def delete_borrowing_request(request_id):
    borrowing_request = db.session.get(BorrowingRequest, request_id)
    if borrowing_request is None:
        return jsonify({"error": "Borrowing request not found."}), 404
    db.session.delete(borrowing_request)
    db.session.commit()
    return jsonify({"message": "Borrowing request deleted successfully"}), 200