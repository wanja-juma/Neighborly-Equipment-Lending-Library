from marshmallow import fields, validate

from app.extensions import ma
from models import Profile


class ProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Profile
        load_instance = True
        include_fk = True
        ordered = True

    id = fields.Integer(dump_only=True)

    user_id = fields.Integer(
        required=True,
        load_only=True,
    )

    first_name = fields.String(
        required=True,
        validate=validate.Length(
            min=1,
            max=100,
        ),
    )

    last_name = fields.String(
        required=True,
        validate=validate.Length(
            min=1,
            max=100,
        ),
    )

    phone_number = fields.String(
        allow_none=True,
        validate=validate.Length(max=20),
    )

    address = fields.String(
        allow_none=True,
        validate=validate.Length(max=255),
    )

    avatar_url = fields.String(
        allow_none=True,
        validate=validate.Length(max=500),
    )

    bio = fields.String(
        allow_none=True,
    )