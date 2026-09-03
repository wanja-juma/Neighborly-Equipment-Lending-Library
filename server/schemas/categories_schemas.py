from flask_marshmallow import Marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from models.categories import Category


ma = Marshmallow()


class CategorySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True


category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)