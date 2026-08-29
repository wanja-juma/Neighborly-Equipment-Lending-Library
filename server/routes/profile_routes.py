from flask import Blueprint, jsonify, request
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
    url_prefix="/api/profiles",
)

profile_schema = ProfileSchema()


@profile_bp.get("/<int:profile_id>")
@jwt_required()
def get_profile(profile_id):
    profile = db.session.get(
        Profile,
        profile_id,
    )

    if profile is None:
        return jsonify(
            {"error": "Profile not found."}
        ), 404

    return jsonify(
        {
            "profile": profile_schema.dump(
                profile
            ),
        }
    ), 200


@profile_bp.patch("/<int:profile_id>")
@jwt_required()
def update_profile(profile_id):
    current_user_id = int(
        get_jwt_identity()
    )

    profile = db.session.get(
        Profile,
        profile_id,
    )

    if profile is None:
        return jsonify(
            {"error": "Profile not found."}
        ), 404

    if profile.user_id != current_user_id:
        return jsonify(
            {
                "error": (
                    "You are not authorized to "
                    "update this profile."
                )
            }
        ), 403

    json_data = request.get_json(silent=True)

    if not json_data:
        return jsonify(
            {"error": "Request body is required."}
        ), 400

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
        return jsonify(
            {
                "error": (
                    "The id and user_id fields "
                    "cannot be updated."
                )
            }
        ), 400

    try:
        updated_profile = profile_schema.load(
            json_data,
            instance=profile,
            session=db.session,
            partial=True,
        )
    except ValidationError as error:
        return jsonify(
            {
                "error": "Validation failed.",
                "details": error.messages,
            }
        ), 400

    try:
        db.session.add(updated_profile)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()

        return jsonify(
            {
                "error": (
                    "The phone number is already "
                    "in use."
                )
            }
        ), 409

    return jsonify(
        {
            "message": (
                "Profile updated successfully."
            ),
            "profile": profile_schema.dump(
                updated_profile
            ),
        }
    ), 200