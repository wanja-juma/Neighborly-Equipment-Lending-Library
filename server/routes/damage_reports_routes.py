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

class DamageReportResource(Resource):
    pass

