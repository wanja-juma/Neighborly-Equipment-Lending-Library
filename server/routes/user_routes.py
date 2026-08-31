from flask import (
    Blueprint,
    request,
)
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)
from flask_restful import (
    Api,
    Resource,
)
from sqlalchemy.exc import (
    IntegrityError,
    SQLAlchemyError,
)

from app.extensions import db
from models import User
<<<<<<< HEAD
from schemas import UserSchema
=======
>>>>>>> ce4be8f58662b5e942e1ee34609345f77ec35da6


user_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users",
)

user_api = Api(user_bp)


def get_authenticated_user():
    identity = get_jwt_identity()

    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return None

    return db.session.get(
        User,
        user_id,
    )


class ChangePassword(Resource):
    @jwt_required()
    def put(self):
        user = get_authenticated_user()

        if user is None:
            return {
                "error": "User not found."
            }, 404

        json_data = request.get_json(
            silent=True
        )

        if not json_data:
            return {
                "error": (
                    "Request body is required."
                )
            }, 400

        current_password = json_data.get(
            "current_password",
            "",
        )

        new_password = json_data.get(
            "new_password",
            "",
        )

        confirm_password = json_data.get(
            "confirm_password",
            "",
        )

        if (
            not current_password
            or not new_password
            or not confirm_password
        ):
            return {
                "error": (
                    "Current password, new "
                    "password and confirmation "
                    "are required."
                )
            }, 400

        if not user.check_password(
            current_password
        ):
            return {
                "error": (
                    "The current password is "
                    "incorrect."
                )
            }, 401

        if (
            new_password !=
            confirm_password
        ):
            return {
                "error": (
                    "The new passwords do not "
                    "match."
                )
            }, 400

        if user.check_password(
            new_password
        ):
            return {
                "error": (
                    "The new password must be "
                    "different from the current "
                    "password."
                )
            }, 400

        try:
            user.set_password(
                new_password
            )

            db.session.add(user)
            db.session.commit()

        except ValueError as error:
            db.session.rollback()

            return {
                "error": str(error)
            }, 400

        except SQLAlchemyError:
            db.session.rollback()

            return {
                "error": (
                    "The password could not be "
                    "updated."
                )
            }, 500

        return {
            "message": (
                "Password changed successfully."
            )
        }, 200

user_api.add_resource( ChangePassword, "/me/password",)


class DeleteAccount(Resource):
    @jwt_required()
    def delete(self):
        user = get_authenticated_user()

        if user is None:
            return {
                "error": "User not found."
            }, 404

        json_data = request.get_json(
            silent=True
        ) or {}

        password = json_data.get(
            "password",
            "",
        )

        if not password:
            return {
                "error": (
                    "Your password is required "
                    "to delete the account."
                )
            }, 400

        if not user.check_password(
            password
        ):
            return {
                "error": (
                    "The password is incorrect."
                )
            }, 401

        try:
            db.session.delete(user)
            db.session.commit()

        except IntegrityError:
            db.session.rollback()

            return {
                "error": (
                    "The account cannot be "
                    "deleted while it has active "
                    "items, requests, loans or "
                    "payments."
                )
            }, 409

        except SQLAlchemyError:
            db.session.rollback()

            return {
                "error": (
                    "The account could not be "
                    "deleted."
                )
            }, 500

        return {
            "message": (
                "Account deleted successfully."
            )
        }, 200

user_api.add_resource(
    DeleteAccount,
    "/me",
)


