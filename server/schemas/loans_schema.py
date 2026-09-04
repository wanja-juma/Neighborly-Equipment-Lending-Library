
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
    returned_at = fields.DateTime(allow_none=True, data_key="returnedAt")

    status = fields.Str(
        validate=validate.OneOf(["active", "returned", "overdue"]),
        load_default="active"
    )

    # Extra frontend-friendly data.
    item = fields.Method("get_item", dump_only=True)
    borrower = fields.Method("get_borrower", dump_only=True)
    owner_id = fields.Method("get_owner_id", dump_only=True)

    def get_item(self, loan):
        item = getattr(loan, "item", None)
        if item is None:
            return None
        return {
            "id": item.id,
            "name": item.name,
            "icon": getattr(item, "icon", None),
            "owner_id": item.owner_id,
        }

    def get_owner_id(self, loan):
        item = getattr(loan, "item", None)
        if item is None:
            return None
        return item.owner_id

    def get_borrower(self, loan):
        user = getattr(loan, "borrower", None)
        if user is None:
            return None
        
        return {
            "id": user.id,
            "name": getattr(user, "name", None) or "Neighbour",
        }
    


loan_schema = LoanSchema()

loans_schema = LoanSchema(many=True)