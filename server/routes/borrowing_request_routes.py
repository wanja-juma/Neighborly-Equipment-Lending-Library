from flask import Blueprint, request
from flask_restful import Api, Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from models import BorrowingRequest
from schemas.borrowing_request_schemas import (
    borrowing_request_schema,
    borrowing_requests_schema,
)


borrowing_request_bp = Blueprint(
    "borrowing_requests",
    __name__,
    url_prefix="/api/borrowingRequests",
)

borrowing_request_api = Api(
    borrowing_request_bp
)


class BorrowingRequestListResource(
    Resource
):
    def get(self):
        borrowing_requests = (
            BorrowingRequest.query.all()
        )

        return (
            borrowing_requests_schema.dump(
                borrowing_requests
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
            new_request = (
                borrowing_request_schema.load(
                    json_data,
                    session=db.session,
                )
            )

            db.session.add(new_request)
            db.session.commit()

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400

        except IntegrityError:
            db.session.rollback()

            return {
                "error": (
                    "The borrowing request could "
                    "not be created."
                )
            }, 409

        return (
            borrowing_request_schema.dump(
                new_request
            ),
            201,
        )


class BorrowingRequestResource(Resource):
    def get(self, request_id):
        borrowing_request = (
            db.session.get(
                BorrowingRequest,
                request_id,
            )
        )

        if borrowing_request is None:
            return {
                "error": (
                    "Borrowing request not found."
                )
            }, 404

        return (
            borrowing_request_schema.dump(
                borrowing_request
            ),
            200,
        )

    def patch(self, request_id):
        borrowing_request = (
            db.session.get(
                BorrowingRequest,
                request_id,
            )
        )

        if borrowing_request is None:
            return {
                "error": (
                    "Borrowing request not found."
                )
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
            updated_request = (
                borrowing_request_schema.load(
                    json_data,
                    instance=borrowing_request,
                    partial=True,
                    session=db.session,
                )
            )

            db.session.add(updated_request)
            db.session.commit()

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400

        except IntegrityError:
            db.session.rollback()

            return {
                "error": (
                    "The borrowing request could "
                    "not be updated."
                )
            }, 409

        return (
            borrowing_request_schema.dump(
                updated_request
            ),
            200,
        )

    def delete(self, request_id):
        borrowing_request = (
            db.session.get(
                BorrowingRequest,
                request_id,
            )
        )

        if borrowing_request is None:
            return {
                "error": (
                    "Borrowing request not found."
                )
            }, 404

        db.session.delete(borrowing_request)
        db.session.commit()

        return {
            "message": (
                "Borrowing request deleted "
                "successfully."
            )
        }, 200


borrowing_request_api.add_resource(
    BorrowingRequestListResource,
    "",
    "/",
)

borrowing_request_api.add_resource(
    BorrowingRequestResource,
    "/<int:request_id>",
)