from flask import request
from flask_restful import Resource
from marshmallow import ValidationError
from server.models import db
from server.models.borrowing_requests import BorrowingRequest
from server.schemas.borrowing_requests_schemas import (
    borrowing_request_schema, 
    borrowing_requests_schema
)

class BorrowingRequestListResource(Resource):
    def get(self):
        requests = BorrowingRequest.query.all()
        return borrowing_requests_schema.dump(requests), 200

    def post(self):
        json_data = request.get_json()
        try:
            new_request = borrowing_request_schema.load(json_data, session=db.session)
            db.session.add(new_request)
            db.session.commit()
            return borrowing_request_schema.dump(new_request), 201
        except ValidationError as err:
            return {"errors": err.messages}, 400


class BorrowingRequestResource(Resource):
    def get(self, request_id):
        req = BorrowingRequest.query.get_or_404(request_id, description="Borrowing request not found")
        return borrowing_request_schema.dump(req), 200

    def patch(self, request_id):
        req = BorrowingRequest.query.get_or_404(request_id, description="Borrowing request not found")
        json_data = request.get_json()
        try:
            updated_req = borrowing_request_schema.load(json_data, instance=req, partial=True, session=db.session)
            db.session.commit()
            return borrowing_request_schema.dump(updated_req), 200
        except ValidationError as err:
            return {"errors": err.messages}, 400

    def delete(self, request_id):
        req = BorrowingRequest.query.get_or_404(request_id, description="Borrowing request not found")
        db.session.delete(req)
        db.session.commit()
        return {'message': 'Borrowing request deleted successfully'}, 200