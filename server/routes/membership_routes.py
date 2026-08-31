from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError

from app.extensions import db
from models import Membership
from schemas.membership_schemas import (
    MembershipSchema,
)
from schemas import MembershipSchema

membership_bp = Blueprint(
    "memberships",
    __name__,
    url_prefix="/api/memberships",
)

membership_schema = MembershipSchema()


@membership_bp.get("/<int:membership_id>")
@jwt_required()
def get_membership(membership_id):
    membership = db.session.get(Membership, membership_id)

    if membership is None:
        return jsonify({"error": "Membership not found."}), 404

    current_user_id = int(get_jwt_identity())
    if membership.user_id != current_user_id:
        return jsonify({"error": "You are not authorized to view this membership."}), 403

    return jsonify({"membership": membership_schema.dump(membership)}), 200


@membership_bp.post("")
@jwt_required()
def create_membership():
    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    current_user_id = int(get_jwt_identity())
    json_data["user_id"] = current_user_id 

    try:
        membership = membership_schema.load(json_data, session=db.session)
    except ValidationError as error:
        return jsonify({"error": "Validation failed.", "details": error.messages}), 400

    db.session.add(membership)
    db.session.commit()

    return jsonify({"membership": membership_schema.dump(membership)}), 201


@membership_bp.patch("/<int:membership_id>")
@jwt_required()
def update_membership(membership_id):
    membership = db.session.get(Membership, membership_id)

    if membership is None:
        return jsonify({"error": "Membership not found."}), 404

    current_user_id = int(get_jwt_identity())
    if membership.user_id != current_user_id:
        return jsonify({"error": "You are not authorized to update this membership."}), 403

    json_data = request.get_json(silent=True)
    if not json_data:
        return jsonify({"error": "Request body is required."}), 400

    protected_fields = {"id", "user_id"}
    if protected_fields.intersection(json_data.keys()):
        return jsonify({"error": "The id and user_id fields cannot be updated."}), 400

    try:
        updated = membership_schema.load(
            json_data, instance=membership, session=db.session, partial=True
        )
    except ValidationError as error:
        return jsonify({"error": "Validation failed.", "details": error.messages}), 400

    db.session.add(updated)
    db.session.commit()

    return jsonify({"membership": membership_schema.dump(updated)}), 200