from flask import Blueprint, jsonify, request

from flask_restful import (
    Api,
    Resource,
)
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from models import Profile
from schemas.profile_schema import (
    ProfileSchema,
)


profile_bp = Blueprint(
    "profiles",
    __name__,
    url_prefix="/api",
)

profile_api = Api(profile_bp)

profile_schema = ProfileSchema()


@profile_bp.get(
    "/profiles/<int:profile_id>"
)
@jwt_required()
def get_profile(profile_id):
    profile = db.session.get(
        Profile,
        profile_id,
    )

    if profile is None:
        return jsonify(
            {
                "error": (
                    "Profile not found."
                )
            }
        ), 404

    return jsonify(
        {
            "profile": (
                profile_schema.dump(
                    profile
                )
            ),
        }
    ), 200

class OwnProfile(Resource):
    @jwt_required()
    def put(self):
        identity = get_jwt_identity()

        try:
            current_user_id = int(
                identity
            )
        except (TypeError, ValueError):
            return {
                "error": (
                    "Invalid authentication "
                    "identity."
                )
            }, 401

        profile = db.session.scalar(
            db.select(Profile).where(
                Profile.user_id ==
                current_user_id
            )
        )

        if profile is None:
            return {
                "error": (
                    "Profile not found."
                )
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

        protected_fields = {
            "id",
            "user_id",
        }

        attempted_protected_fields = (
            protected_fields.intersection(
                json_data.keys()
            )
        )

        if attempted_protected_fields:
            return {
                "error": (
                    "The id and user_id fields "
                    "cannot be updated."
                )
            }, 400

        allowed_fields = {
            "first_name",
            "last_name",
            "phone_number",
            "address",
            "avatar_url",
            "bio",
        }

        unknown_fields = (
            set(json_data.keys()) -
            allowed_fields
        )

        if unknown_fields:
            return {
                "error": (
                    "Unknown profile fields."
                ),
                "fields": sorted(
                    unknown_fields
                ),
            }, 400

        try:
            updated_profile = (
                profile_schema.load(
                    json_data,
                    instance=profile,
                    session=db.session,
                    partial=True,
                )
            )

            db.session.add(
                updated_profile
            )

            db.session.commit()

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": (
                    "Validation failed."
                ),
                "details": error.messages,
            }, 400

        except IntegrityError:
            db.session.rollback()

            return {
                "error": (
                    "The phone number is already "
                    "in use."
                )
            }, 409

        return {
            "message": (
                "Profile updated successfully."
            ),
            "profile": profile_schema.dump(
                updated_profile
            ),
        }, 200


profile_api.add_resource( OwnProfile, "/profile",)