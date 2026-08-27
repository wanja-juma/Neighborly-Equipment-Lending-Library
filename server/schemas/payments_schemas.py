from marshmallow import fields, validate

from app.extensions import ma
from models import Payment


class PaymentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True
        include_fk = True
        ordered = True

    id = fields.Integer(dump_only=True)

    loan_id = fields.Integer(
        required=True,
        load_only=True,
    )

    amount = fields.Decimal(required=True, as_string=True, places=2)

    status = fields.String(
        required=True,
        validate=validate.OneOf(['held', 'refunded', 'forfeited']),
    )

    paid_at = fields.DateTime(allow_none=True)
    refunded_at = fields.DateTime(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)