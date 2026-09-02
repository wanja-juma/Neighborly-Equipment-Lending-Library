from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.profile import Profile


profiles_bp = Blueprint(
    "profiles",
    __name__,
    url_prefix="/api/profiles",
)


def serialize_profile(profile):
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "phone_number": profile.phone_number,
        "address": profile.address,
        "avatar_url": profile.avatar_url,
        "bio": profile.bio,
        "email": (
            profile.user.email
            if profile.user
            else None
        ),
    }


# -------------------------------------------------
# GET /api/profiles/<profile_id>
# Fetch a particular profile by its profile ID
# -------------------------------------------------
@profiles_bp.route(
    "/<int:profile_id>",
    methods=["GET"],
)
@jwt_required()
def get_profile(profile_id):
    profile = db.session.get(
        Profile,
        profile_id,
    )

    if not profile:
        return (
            jsonify({
                "error": "Profile not found."
            }),
            404,
        )

    return (
        jsonify({
            "profile":
                serialize_profile(
                    profile
                )
        }),
        200,
    )


# -------------------------------------------------
# PUT /api/profiles/me
# Update the currently logged-in user's profile
# -------------------------------------------------
@profiles_bp.route(
    "/me",
    methods=["PUT"],
)
@jwt_required()
def update_my_profile():
    current_user_id = int(
        get_jwt_identity()
    )

    profile = Profile.query.filter_by(
        user_id=current_user_id
    ).first()

    if not profile:
        return (
            jsonify({
                "error":
                    "Profile not found."
            }),
            404,
        )

    data = request.get_json(
        silent=True
    ) or {}

    allowed_fields = {
        "first_name",
        "last_name",
        "phone_number",
        "address",
        "avatar_url",
        "bio",
    }

    for field in allowed_fields:
        if field in data:
            value = data[field]

            if (
                isinstance(
                    value,
                    str,
                )
            ):
                value = value.strip()

            setattr(
                profile,
                field,
                value,
            )

    if (
        not profile.first_name
        or not profile.first_name.strip()
    ):
        return (
            jsonify({
                "error":
                    "First name is required."
            }),
            400,
        )

    if (
        not profile.last_name
        or not profile.last_name.strip()
    ):
        return (
            jsonify({
                "error":
                    "Last name is required."
            }),
            400,
        )

    try:
        db.session.commit()

    except Exception:
        db.session.rollback()

        return (
            jsonify({
                "error":
                    "Unable to update profile."
            }),
            500,
        )

    return (
        jsonify({
            "message":
                "Profile updated successfully.",
            "profile":
                serialize_profile(
                    profile
                ),
        }),
        200,
    )