from marshmallow import fields, validate

from app.extensions import ma
from models import Membership
from models import Membership

class MembershipSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Membership
        load_instance = True
        include_fk = True
        ordered = True

    id = fields.Integer(dump_only=True)

    user_id = fields.Integer(
        required=True,
        load_only=True,
    )

    status = fields.String(
        required=True,
        validate=validate.OneOf(['active', 'inactive', 'suspended']),
    )

    start_date = fields.Date(allow_none=True)
    end_date = fields.Date(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)