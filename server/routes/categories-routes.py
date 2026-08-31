from flask import request
from flask_restful import Resource
from marshmallow import ValidationError

from app.extensions import db
from models.categories import Category
from schemas.categories_schemas import category_schema, categories_schema


class CategoryListResource(Resource):
    def get(self):
        categories = Category.query.all()
        return categories_schema.dump(categories), 200

    def post(self):
        json_data = request.get_json()

        try:
            new_category = category_schema.load(
                json_data,
                session=db.session
            )

            db.session.add(new_category)
            db.session.commit()

            return category_schema.dump(new_category), 201

        except Exception as err:
            db.session.rollback()
            return {"error": str(err)}, 400


class CategoryResource(Resource):
    def get(self, category_id):
        category = Category.query.get_or_404(
            category_id,
            description="Category not found"
        )

        return category_schema.dump(category), 200

    def patch(self, category_id):
        category = Category.query.get_or_404(
            category_id,
            description="Category not found"
        )

        json_data = request.get_json()

        try:
            updated_category = category_schema.load(
                json_data,
                instance=category,
                partial=True,
                session=db.session
            )

            db.session.commit()

            return category_schema.dump(updated_category), 200

        except Exception as err:
            db.session.rollback()
            return {"error": str(err)}, 400

    def delete(self, category_id):
        category = Category.query.get_or_404(
            category_id,
            description="Category not found"
        )

        db.session.delete(category)
        db.session.commit()

        return {
            "message": "Category deleted successfully"
        }, 200