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
 
   