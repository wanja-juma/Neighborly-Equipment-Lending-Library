from flask_marshmallow import Marshmallow
from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import Loan

ma = Marshmallow()

class LoanSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Loan
        load_instance = True
        include_fk = True

    # Explicit field definitions for strict serialization / deserialization
    status = fields.String(validate=validate.OneOf(["pending", "approved", "rejected", "returned"]))
    requested_at = fields.DateTime(format="%Y-%m-%dT%H:%M:%S", dump_only=True)
    approved_at = fields.DateTime(format="%Y-%m-%dT%H:%M:%S", allow_none=True)
    returned_at = fields.DateTime(format="%Y-%m-%dT%H:%M:%S", allow_none=True)
    created_at = fields.DateTime(format="%Y-%m-%dT%H:%M:%S", dump_only=True)
    start_date = fields.Date(format="%Y-%m-%d", allow_none=True)
    due_date = fields.Date(format="%Y-%m-%d", allow_none=True)

loan_schema = LoanSchema()
loans_schema = LoanSchema(many=True)