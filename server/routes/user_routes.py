from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.extensions import db
from models import User
from schemas.user_schema import UserSchema


user_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users",
)

user_schema = UserSchema()


@user_bp.get("/<int:user_id>")
@jwt_required()
def get_user(user_id):
    user = db.session.get(User, user_id)

    if user is None:
        return jsonify(
            {"error": "User not found."}
        ), 404

    return jsonify(
        {
            "user": user_schema.dump(user),
        }
    ), 200