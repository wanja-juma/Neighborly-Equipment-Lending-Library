from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models.loans import Loan


class LoanSchema(SQLAlchemyAutoSchema):

    class Meta:
        model = Loan
        load_instance = True

    id = fields.Int(dump_only=True)

    user_id = fields.Int(
        required=True
    )

    equipment_id = fields.Int(
        required=True
    )

    loan_date = fields.DateTime(
        dump_only=True
    )

    due_date = fields.DateTime(
        required=True
    )

    return_date = fields.DateTime(
        allow_none=True
    )

    status = fields.Str(
        validate=validate.OneOf([
            "active",
            "returned",
            "overdue"
        ]),
        load_default="active"
    )


loan_schema = LoanSchema()

loans_schema = LoanSchema(many=True)