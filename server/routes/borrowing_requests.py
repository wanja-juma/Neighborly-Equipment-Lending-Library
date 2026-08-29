from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError
from app.extensions import db
from models import BorrowingRequest, Loan
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
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        data = borrowing_request_schema.load(json_data, partial=("status",))
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    loan = db.session.get(Loan, data.loan_id)
    if loan is None:
        return jsonify({"error": "Loan not found."}), 404

    data.status = "pending"
    db.session.add(data)
    db.session.commit()
    return jsonify({"borrowing_request": borrowing_request_schema.dump(data)}), 201


@borrowing_requests_bp.get("")
@jwt_required()
def list_requests():
    query = BorrowingRequest.query

    loan_id = request.args.get("loan_id")
    if loan_id:
        query = query.filter_by(loan_id=loan_id)

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

    json_data = request.get_json()
    if not json_data or "status" not in json_data:
        return jsonify({"error": "Missing 'status' field."}), 400

    new_status = json_data["status"]
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
