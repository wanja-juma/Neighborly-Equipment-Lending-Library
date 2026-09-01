from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError

from app.extensions import db
from models import Membership

from schemas.membership_schemas import MembershipSchema

membership_bp = Blueprint(
    "memberships",
    __name__,
    url_prefix="/api/memberships",
)

membership_schema = MembershipSchema()


class MembershipListResource(Resource):
    method_decorators = [jwt_required()]
 
    def post(self):
        json_data = request.get_json(silent=True)
        if not json_data:
            return {"error": "Request body is required."}, 400