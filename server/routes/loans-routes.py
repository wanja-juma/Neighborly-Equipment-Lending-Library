from flask import request
from flask_restful import Resource
from marshmallow import ValidationError
from server.models import db
from server.models.loans import Loan
from server.schemas.loans_schemas import loan_schema, loans_schema

class LoanListResource(Resource):
    def get(self):
        loans = Loan.query.all()
        return loans_schema.dump(loans), 200

    def post(self):
        json_data = request.get_json()
        try:
            new_loan = loan_schema.load(json_data, session=db.session)
            db.session.add(new_loan)
            db.session.commit()
            return loan_schema.dump(new_loan), 201
        except ValidationError as err:
            return {"errors": err.messages}, 400


class LoanResource(Resource):
    def get(self, loan_id):
        loan = Loan.query.get_or_404(loan_id, description="Loan record not found")
        return loan_schema.dump(loan), 200

    def patch(self, loan_id):
        loan = Loan.query.get_or_404(loan_id, description="Loan record not found")
        json_data = request.get_json()
        try:
            updated_loan = loan_schema.load(json_data, instance=loan, partial=True, session=db.session)
            db.session.commit()
            return loan_schema.dump(updated_loan), 200
        except ValidationError as err:
            return {"errors": err.messages}, 400

    def delete(self, loan_id):
        loan = Loan.query.get_or_404(loan_id, description="Loan record not found")
        db.session.delete(loan)
        db.session.commit()
        return {'message': 'Loan deleted successfully'}, 200