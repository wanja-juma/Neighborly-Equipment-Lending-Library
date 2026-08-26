from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

REQUIRED_FIELDS = ("firstName", "lastName", "email", "password")


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}

    missing = [field for field in REQUIRED_FIELDS if not data.get(field)]
    if missing:
        return (
            jsonify({"message": f"Missing required field(s): {', '.join(missing)}"}),
            400,
        )

    first_name = data["firstName"].strip()
    last_name = data["lastName"].strip()
    email = data["email"].strip().lower()
    password = data["password"]

    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"message": "Please enter a valid email address"}), 400

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    password_hash = generate_password_hash(password)


    return (
        jsonify(
            {
                "message": "Validation passed, but the User model isn't implemented yet "
                "so registration can't be persisted.",
                "received": {
                    "firstName": first_name,
                    "lastName": last_name,
                    "email": email,
                },
            }
        ),
        501,
    )


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}

    missing = [field for field in ("email", "password") if not data.get(field)]
    if missing:
        return (
            jsonify({"message": f"Missing required field(s): {', '.join(missing)}"}),
            400,
        )

    email = data["email"].strip().lower()


    return (
        jsonify(
            {
                "message": "Validation passed, but the User model isn't implemented yet "
                "so login can't be verified.",
                "received": {"email": email},
            }
        ),
        501,
    )


@auth_bp.get("/me")
def me():
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    token = auth_header.removeprefix("Bearer ").strip()
    if not token:
        return jsonify({"message": "Missing or invalid Authorization header"}), 401
    
    return (
        jsonify(
            {
                "message": "Authorization header present, but token verification isn't "
                "implemented yet so the current user can't be resolved.",
            }
        ),
        501,
    )


@auth_bp.post("/logout")
def logout():
    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return jsonify({"message": "Missing or invalid Authorization header"}), 401

    token = auth_header.removeprefix("Bearer ").strip()
    if not token:
        return jsonify({"message": "Missing or invalid Authorization header"}), 401


    return (
        jsonify(
            {
                "message": "Authorization header present, but token revocation isn't "
                "implemented yet so nothing was actually invalidated.",
            }
        ),
        501,
    )
