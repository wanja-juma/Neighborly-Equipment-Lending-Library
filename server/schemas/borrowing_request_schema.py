from app.extensions import ma
from marshmallow import fields
from models import BorrowingRequest


class BorrowingRequestSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = BorrowingRequest
        load_instance = True
        ordered = True

    id = fields.Integer(dump_only=True)
    item_id = fields.Integer(required=True)
    borrower_id = fields.Integer(required=True)
    status = fields.String(dump_only=True)
    notification = fields.String(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
