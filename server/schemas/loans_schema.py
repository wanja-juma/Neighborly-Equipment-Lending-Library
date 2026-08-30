from marshmallow import Schema, fields, validate


class LoanSchema(Schema):
    id = fields.Int(dump_only=True)
    item_id = fields.Int(required=True)
    borrower_id = fields.Int(required=True)
    requested_at = fields.DateTime(dump_only=True)
    approved_at = fields.DateTime(allow_none=True)
    status = fields.Str(
        validate=validate.OneOf(
            ["pending", "approved", "rejected", "returned", "active"]
        ),
        load_default="pending",
    )
    start_date = fields.Date(allow_none=True)
    due_date = fields.Date(allow_none=True)
    returned_at = fields.DateTime(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

    
    item = fields.Nested("ItemSchema", dump_only=True, exclude=("loans",))
    borrower = fields.Nested("UserSchema", dump_only=True, exclude=("loans",))


loan_schema = LoanSchema()
loans_schema = LoanSchema(many=True)