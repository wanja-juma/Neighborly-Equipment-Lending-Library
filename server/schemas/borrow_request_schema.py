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

    loan_id = fields.Int(
        dump_only=True,
        allow_none=True
    )

    user_id = fields.Int(
        required=True
    )

    equipment_id = fields.Int(
        required=True
    )

    start_date = fields.DateTime(
        required=True
    )

    end_date = fields.DateTime(
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


borrowing_request_schema = BorrowingRequestSchema()

borrowing_requests_schema = BorrowingRequestSchema(
    many=True
)