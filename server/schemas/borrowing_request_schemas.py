from flask_marshmallow import Marshmallow
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import BorrowingRequest

ma = Marshmallow()

class BorrowingRequestSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = BorrowingRequest
        load_instance = True
        include_fk = True

    status = fields.String(validate=validate.OneOf(["pending", "approved", "rejected", "cancelled"]))
    notification = fields.String(allow_none=True)
    created_at = fields.DateTime(format="%Y-%m-%dT%H:%M:%S", dump_only=True)
    updated_at = fields.DateTime(format="%Y-%m-%dT%H:%M:%S", dump_only=True)

borrowing_request_schema = BorrowingRequestSchema()
borrowing_requests_schema = BorrowingRequestSchema(many=True)