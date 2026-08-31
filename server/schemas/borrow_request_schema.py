from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models.borrow_request import BorrowingRequest


class BorrowingRequestSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = BorrowingRequest
        load_instance = True

    id = fields.Int(
        dump_only=True
    )

    user_id = fields.Int(
        required=True
    )

    equipment_id = fields.Int(
        required=True
    )

    request_date = fields.DateTime(
        dump_only=True
    )

    status = fields.Str(
        validate=validate.OneOf([
            "pending",
            "approved",
            "rejected",
            "cancelled"
        ]),
        load_default="pending"
    )

    message = fields.Str(
        allow_none=True
    )


<<<<<<< HEAD
borrow_request_schema = BorrowingRequestSchema()

borrow_requests_schema = BorrowingRequestSchema(
=======

borrowing_request_schema = BorrowingRequestSchema()

borrowing_requests_schema = BorrowingRequestSchema(
>>>>>>> ebe99d5140718ab0a26d6c0ce4f2277a0394f3f5
    many=True
)