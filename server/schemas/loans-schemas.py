from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import Loan

ma = Marshmallow()

class LoanSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Loan
        load_instance = True
        include_fk = True

loan_schema = LoanSchema()
loans_schema = LoanSchema(many=True)