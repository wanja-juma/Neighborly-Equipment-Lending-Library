from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models.loans import Loan


class LoanSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Loan
        load_instance = True

    id = fields.Int(dump_only=True)

    item_id = fields.Int(required=True)
    borrower_id = fields.Int(required=True)

    start_date = fields.DateTime(required=True)
    end_date = fields.DateTime(required=True)

    requested_at = fields.DateTime(dump_only=True)
    approved_at = fields.DateTime(dump_only=True)
    due_date = fields.DateTime(allow_none=True)
    returned_at = fields.DateTime(allow_none=True)
    

    status = fields.Str(
        validate=validate.OneOf(["active", "returned", "overdue"]),
        load_default="active"
    )


loan_schema = LoanSchema()

loans_schema = LoanSchema(many=True)