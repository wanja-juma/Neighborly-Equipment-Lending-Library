from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from marshmallow import ValidationError

from app.extensions import db
from models import Profile, User
from schemas import ProfileSchema, UserSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

user_schema = UserSchema()
profile_schema = ProfileSchema()


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    try:
        user = user_schema.load(
            {"email": data.get("email"), "password": data.get("password")}
        )
    except ValidationError as err:
        return jsonify({"message": "Validation failed", "errors": err.messages}), 400

    if db.session.query(User).filter_by(email=user.email).first():
        return jsonify({"message": "An account with that email already exists"}), 409

    db.session.add(user)
    db.session.flush()  # assigns user.id, needed for the profile's FK

    try:
        profile = profile_schema.load(
            {
                "user_id": user.id,
                "first_name": data.get("firstName"),
                "last_name": data.get("lastName"),
            }
        )
    except ValidationError as err:
        db.session.rollback()
        return jsonify({"message": "Validation failed", "errors": err.messages}), 400

    db.session.add(profile)
    db.session.commit()

    token = create_access_token(identity=str(user.id))

    return jsonify({"user": user_schema.dump(user), "accessToken": token}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"message": "Missing required field(s): email, password"}), 400

    user = db.session.query(User).filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({"user": user_schema.dump(user), "accessToken": token})


@auth_bp.get("/me")
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user_schema.dump(user)})


@auth_bp.post("/logout")
@jwt_required()
def logout():
    # JWTs are stateless here -- there's no server-side session or token
    # blocklist to clear, so this just confirms the token was valid. The
    # frontend is responsible for discarding its stored token. If real
    # server-side revocation is needed later, wire up flask_jwt_extended's
    # token-blocklist support (a revoked-JTI table + jwt.token_in_blocklist_loader).
    return jsonify({"message": "Logged out"})
