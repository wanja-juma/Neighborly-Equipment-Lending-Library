from app.extensions import ma
from marshmallow import fields, validate
from models import BorrowingRequest

VALID_STATUSES = ["pending", "approved", "rejected", "returned", "cancelled"]


class BorrowingRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BorrowingRequest
        load_instance = True
        ordered = True

    id = fields.Integer(dump_only=True)
    loan_id = fields.Integer(required=True)
    status = fields.String(
        dump_default="pending",
        validate=validate.OneOf(VALID_STATUSES),
    )
    notification = fields.String(
        allow_none=True,
        validate=validate.Length(max=255),
    )
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
