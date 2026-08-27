from flask import Blueprint, request, jsonify
from extensions import db
from models import BorrowingRequest

borrowing_requests_bp = Blueprint("borrowing_requests", __name__, url_prefix="/borrowing-requests")


@borrowing_requests_bp.route("", methods=["POST"])
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
    return jsonify(new_request.to_dict()), 201


@borrowing_requests_bp.route("", methods=["GET"])
def list_requests():
    query = BorrowingRequest.query

    borrower_id = request.args.get("borrower_id")
    if borrower_id:
        query = query.filter_by(borrower_id=borrower_id)

    item_id = request.args.get("item_id")
    if item_id:
        query = query.filter_by(item_id=item_id)

    requests = query.order_by(BorrowingRequest.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests]), 200


@borrowing_requests_bp.route("/<int:request_id>", methods=["GET"])
def get_request(request_id):
    br = BorrowingRequest.query.get(request_id)
    if not br:
        return jsonify({"error": "Borrowing request not found"}), 404
    return jsonify(br.to_dict()), 200


@borrowing_requests_bp.route("/<int:request_id>/status", methods=["PATCH"])
def update_status(request_id):
    br = BorrowingRequest.query.get(request_id)
    if not br:
        return jsonify({"error": "Borrowing request not found"}), 404

    data = request.get_json()
    br.status = data.get("status")
    db.session.commit()
    return jsonify(br.to_dict()), 200
