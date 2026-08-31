from marshmallow import fields, validate

from app.extensions import ma
from models import Item


class ItemSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Item
        load_instance = True
        include_fk = True
        ordered = True

    id = fields.Integer(dump_only=True)

    owner_id = fields.Integer(
        required=True,
    )

    name = fields.String(
        required=True,
        validate=validate.Length(
            min=1,
            max=150,
        ),
    )

    description = fields.String(
        allow_none=True,
    )

    image = fields.String(
        allow_none=True,
        validate=validate.Length(max=500),
    )

    category_id = fields.String(
        allow_none=True,
        validate=validate.Length(max=100),
    )

    condition = fields.String(
        allow_none=True,
        validate=validate.Length(max=50),
    )

    status = fields.String(
        allow_none=True,
        validate=validate.Length(max=50),
    )

    created_at = fields.DateTime(
        dump_only=True,
    )

    updated_at = fields.DateTime(
        dump_only=True,
    )
