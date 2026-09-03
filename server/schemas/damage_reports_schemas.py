from marshmallow import fields, validate
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models.damage_reports import DamageReport


class DamageReportSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = DamageReport
        load_instance = True

    id = fields.Int(dump_only=True)

    loan_id = fields.Int(required=True)

    status = fields.Str(
        validate=validate.OneOf(
            ["pending", "resolved"]
        ),
        load_default="pending",
    )

    notes = fields.Str(allow_none=True)

    severity = fields.Str(
        validate=validate.OneOf(
            ["low", "medium", "high"]
        ),
        allow_none=True,
    )

    created_at = fields.DateTime(
        dump_only=True
    )

    resolved_at = fields.DateTime(
        allow_none=True
    )

    item_image = fields.Str(
        allow_none=True
    )


damage_report_schema = DamageReportSchema()

damage_reports_schema = DamageReportSchema(
    many=True
)