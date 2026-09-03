from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Api, Resource
from marshmallow import ValidationError

from app.extensions import db
from models import Membership
from schemas import MembershipSchema

membership_bp = Blueprint(
    "memberships",
    __name__,
    url_prefix="/api/memberships",
)
api = Api(membership_bp)

membership_schema = MembershipSchema()


class MembershipListResource(Resource):
    method_decorators = [jwt_required()]

    def post(self):
        json_data = request.get_json(silent=True)
        if not json_data:
            return {"error": "Request body is required."}, 400

        current_user_id = int(get_jwt_identity())
        json_data["user_id"] = current_user_id

        try:
            membership = membership_schema.load(json_data, session=db.session)
        except ValidationError as error:
            return {"error": "Validation failed.", "details": error.messages}, 400
        except ValueError as error:
            return {"error": str(error)}, 400

        db.session.add(membership)
        db.session.commit()

        return {"membership": membership_schema.dump(membership)}, 201


class MembershipResource(Resource):
    method_decorators = [jwt_required()]

    def get(self, membership_id):
        membership = db.session.get(Membership, membership_id)

        if membership is None:
            return {"error": "Membership not found."}, 404

        current_user_id = int(get_jwt_identity())
        if membership.user_id != current_user_id:
            return {"error": "You are not authorized to view this membership."}, 403

        return {"membership": membership_schema.dump(membership)}, 200

    def patch(self, membership_id):
        membership = db.session.get(Membership, membership_id)

        if membership is None:
            return {"error": "Membership not found."}, 404

        current_user_id = int(get_jwt_identity())
        if membership.user_id != current_user_id:
            return {"error": "You are not authorized to update this membership."}, 403

        json_data = request.get_json(silent=True)
        if not json_data:
            return {"error": "Request body is required."}, 400

        protected_fields = {"id", "user_id"}
        if protected_fields.intersection(json_data.keys()):
            return {"error": "The id and user_id fields cannot be updated."}, 400

        try:
            updated = membership_schema.load(
                json_data, instance=membership, session=db.session, partial=True
            )
        except ValidationError as error:
            return {"error": "Validation failed.", "details": error.messages}, 400
        except ValueError as error:
            return {"error": str(error)}, 400

        db.session.add(updated)
        db.session.commit()

        return {"membership": membership_schema.dump(updated)}, 200


api.add_resource(MembershipListResource, "")
api.add_resource(MembershipResource, "/<int:membership_id>")