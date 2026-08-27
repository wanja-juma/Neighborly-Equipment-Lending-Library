from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError
 
from app.extensions import db
from models import Membership
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