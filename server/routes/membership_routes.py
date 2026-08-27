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

