# auth routes implementation
from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
<<<<<<< HEAD
from marshmallow import ValidationError
=======
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError
>>>>>>> ce4be8f58662b5e942e1ee34609345f77ec35da6

from app.extensions import db
from models import Profile, User
from schemas import ProfileSchema, UserSchema

<<<<<<< HEAD
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")
=======

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth",
)
api = Api(auth_bp)
>>>>>>> ce4be8f58662b5e942e1ee34609345f77ec35da6

user_schema = UserSchema()
profile_schema = ProfileSchema()


class Register(Resource):
    def post(self):
        # registers user to the system
        data = request.get_json(silent=True) or {}

<<<<<<< HEAD
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
=======
        missing_fields = [
            field
            for field in REQUIRED_REGISTER_FIELDS
            if not data.get(field)
        ]

        if missing_fields:
            return {
                "error": (
                    "Missing required field(s): "
                    + ", ".join(missing_fields)
                )
            }, 400

        first_name = data["firstName"].strip()
        last_name = data["lastName"].strip()
        email = data["email"].strip().lower()
        password = data["password"]

        if not first_name or not last_name:
            return {
                "error": (
                    "First name and last name "
                    "are required."
                )
            }, 400

        if (
            "@" not in email
            or "." not in email.split("@")[-1]
        ):
            return {
                "error": (
                    "Please enter a valid "
                    "email address."
                )
            }, 400

        if len(password) < 8:
            return {
                "error": (
                    "Password must be at least "
                    "8 characters."
                )
            }, 400

        existing_user = db.session.scalar(
            db.select(User).where(
                User.email == email
            )
        )

        if existing_user:
            return {
                "error": (
                    "An account with that email "
                    "already exists."
                )
            }, 409

        try:
            user = User(
                email=email,
                password=password,
            )

            user.profile = Profile(
                first_name=first_name,
                last_name=last_name,
            )

            db.session.add(user)
            db.session.commit()

        except (ValueError, IntegrityError) as error:
            db.session.rollback()

            if isinstance(error, ValueError):
                message = str(error)
            else:
                message = (
                    "Unable to create the account. "
                    "The email or phone number may "
                    "already be in use."
                )

            return {"error": message}, 400

        access_token = create_access_token(
            identity=str(user.id)
        )

        return {
            "message": (
                "Account created successfully."
            ),
            "access_token": access_token,
            "user": user_schema.dump(user),
        }, 201

api.add_resource(Register, "/register")   # /api/auth/register



class Login(Resource):
    def post(self):
        # logs in a user into the system
        data = request.get_json(silent=True) or {}

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return {
                "error": (
                    "Email and password are "
                    "required."
                )
            }, 400

        user = db.session.scalar(
            db.select(User).where(
                User.email == email
            )
        )

        if (
            user is None
            or not user.check_password(password)
        ):
            return {
                "error": (
                    "Invalid email or password."
                )
            }, 401

        access_token = create_access_token(
            identity=str(user.id)
        )

        return {
            "message": "Login successful.",
            "access_token": access_token,
            "user": user_schema.dump(user),
        }, 200

api.add_resource(Login, "/login")


class CurrentUser(Resource):
    @jwt_required()
    def get(self):
        # returns the current user details
        user_id = int(get_jwt_identity())

        user = db.session.get(User, user_id)

        if user is None:
            return {"error": "User not found."}, 404

        return {
            "user": user_schema.dump(user),
        }, 200


api.add_resource(CurrentUser, "/current-user")





class Logout(Resource):
    @jwt_required()
    def post(self):
        #logs out a user from the system
        return {
            "message": (
                "Logout successful. Remove the "
                "access token from the client."
            )
        }, 200

api.add_resource(Logout, "/logout")



    
            
          
 
>>>>>>> ce4be8f58662b5e942e1ee34609345f77ec35da6
