from flask import Blueprint, request
from flask_restful import Api, Resource
from marshmallow import ValidationError

from app.extensions import db
from models.damage_reports import DamageReport
from schemas.damage_reports_schemas import (
    damage_report_schema,
    damage_reports_schema,
)


damage_reports_bp = Blueprint(
    "damage_reports",
    __name__,
    url_prefix="/api/damage-reports",
)

api = Api(damage_reports_bp)


class DamageReportListResource(Resource):
    def get(self):
        damage_reports = DamageReport.query.all()

        return (
            damage_reports_schema.dump(
                damage_reports
            ),
            200,
        )

    def post(self):
        json_data = request.get_json(
            silent=True
        )

        if not json_data:
            return {
                "error": (
                    "Request body is required."
                )
            }, 400

        try:
            new_report = damage_report_schema.load(
                json_data,
                session=db.session,
            )

            db.session.add(new_report)
            db.session.commit()

            return (
                damage_report_schema.dump(
                    new_report
                ),
                201,
            )

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400


class DamageReportResource(Resource):
    def get(self, damage_report_id):
        damage_report = db.session.get(
            DamageReport,
            damage_report_id,
        )

        if damage_report is None:
            return {
                "error": "Damage report not found."
            }, 404

        return (
            damage_report_schema.dump(
                damage_report
            ),
            200,
        )

    def patch(self, damage_report_id):
        damage_report = db.session.get(
            DamageReport,
            damage_report_id,
        )

        if damage_report is None:
            return {
                "error": "Damage report not found."
            }, 404

        json_data = request.get_json(
            silent=True
        )

        if not json_data:
            return {
                "error": (
                    "Request body is required."
                )
            }, 400

        try:
            updated_report = damage_report_schema.load(
                json_data,
                instance=damage_report,
                partial=True,
                session=db.session,
            )

            db.session.commit()

            return (
                damage_report_schema.dump(
                    updated_report
                ),
                200,
            )

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400

    def delete(self, damage_report_id):
        damage_report = db.session.get(
            DamageReport,
            damage_report_id,
        )

        if damage_report is None:
            return {
                "error": "Damage report not found."
            }, 404

        db.session.delete(damage_report)
        db.session.commit()

        return {
            "message": (
                "Damage report deleted successfully."
            )
        }, 200


api.add_resource(
    DamageReportListResource,
    "",
)

api.add_resource(
    DamageReportResource,
    "/<int:damage_report_id>",
)

