from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from models import BorrowingRequest
from schemas import BorrowingRequestSchema

borrowing_requests_bp = Blueprint(
    "borrowing_requests",
    __name__,
    url_prefix="/api/borrowing-requests",
)

borrowing_request_schema = BorrowingRequestSchema()
borrowing_requests_schema = BorrowingRequestSchema(many=True)

VALID_STATUSES = {"pending", "approved", "rejected", "returned", "cancelled"}


@borrowing_requests_bp.post("")
@jwt_required()
def create_request():
    data = request.get_json()

    required = ["item_id", "borrower_id"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    new_request = BorrowingRequest(
        item_id=data["item_id"],
        borrower_id=data["borrower_id"],
        status="pending",
        notification=data.get("notification"),
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"borrowing_request": borrowing_request_schema.dump(new_request)}), 201


@borrowing_requests_bp.get("")
@jwt_required()
def list_requests():
    query = BorrowingRequest.query

    borrower_id = request.args.get("borrower_id")
    if borrower_id:
        query = query.filter_by(borrower_id=borrower_id)

    item_id = request.args.get("item_id")
    if item_id:
        query = query.filter_by(item_id=item_id)

    requests = query.order_by(BorrowingRequest.created_at.desc()).all()
    return jsonify({"borrowing_requests": borrowing_requests_schema.dump(requests)}), 200


@borrowing_requests_bp.get("/<int:request_id>")
@jwt_required()
def get_request(request_id):
    br = db.session.get(BorrowingRequest, request_id)
    if br is None:
        return jsonify({"error": "Borrowing request not found."}), 404
    return jsonify({"borrowing_request": borrowing_request_schema.dump(br)}), 200


@borrowing_requests_bp.patch("/<int:request_id>/status")
@jwt_required()
def update_status(request_id):
    br = db.session.get(BorrowingRequest, request_id)
    if br is None:
        return jsonify({"error": "Borrowing request not found."}), 404

    data = request.get_json()
    new_status = data.get("status")
    if new_status not in VALID_STATUSES:
        return jsonify({"error": f"Invalid status. Must be one of {sorted(VALID_STATUSES)}"}), 400

    br.status = new_status
    db.session.commit()
    return jsonify({"borrowing_request": borrowing_request_schema.dump(br)}), 200


@borrowing_requests_bp.delete("/<int:request_id>")
@jwt_required()
def delete_request(request_id):
    br = db.session.get(BorrowingRequest, request_id)
    if br is None:
        return jsonify({"error": "Borrowing request not found."}), 404

    db.session.delete(br)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200
