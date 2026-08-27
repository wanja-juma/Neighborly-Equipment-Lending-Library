from marshmallow import fields, validate

from app.extensions import ma
from models import User
from schemas.profile_schema import ProfileSchema


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        ordered = True
        exclude = (
            "password_hash",
        )

    id = fields.Integer(dump_only=True)

    email = fields.Email(
        required=True,
        validate=validate.Length(max=120),
    )

    password = fields.String(
        required=True,
        load_only=True,
        validate=validate.Length(min=8),
    )

    created_at = fields.DateTime(
        dump_only=True,
    )

    updated_at = fields.DateTime(
        dump_only=True,
    )

    profile = fields.Nested(
        ProfileSchema,
        dump_only=True,
    )