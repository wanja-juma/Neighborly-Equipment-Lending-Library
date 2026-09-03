from flask import Blueprint, request
from flask_restful import Api, Resource
from marshmallow import ValidationError

from app.extensions import db
from models.categories import Category
from schemas.categories_schemas import (
    category_schema,
    categories_schema,
)


categories_bp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/categories",
)

api = Api(categories_bp)


class CategoryListResource(Resource):
    def get(self):
        categories = Category.query.all()

        return categories_schema.dump(categories), 200

    def post(self):
        json_data = request.get_json(silent=True)

        if not json_data:
            return {
                "error": "Request body is required."
            }, 400

        try:
            new_category = category_schema.load(
                json_data,
                session=db.session,
            )

            db.session.add(new_category)
            db.session.commit()

            return (
                category_schema.dump(new_category),
                201,
            )

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400


class CategoryResource(Resource):
    def get(self, category_id):
        category = db.session.get(
            Category,
            category_id,
        )

        if category is None:
            return {
                "error": "Category not found."
            }, 404

        return category_schema.dump(category), 200

    def patch(self, category_id):
        category = db.session.get(
            Category,
            category_id,
        )

        if category is None:
            return {
                "error": "Category not found."
            }, 404

        json_data = request.get_json(silent=True)

        if not json_data:
            return {
                "error": "Request body is required."
            }, 400

        try:
            updated_category = category_schema.load(
                json_data,
                instance=category,
                partial=True,
                session=db.session,
            )

            db.session.commit()

            return (
                category_schema.dump(updated_category),
                200,
            )

        except ValidationError as error:
            db.session.rollback()

            return {
                "error": "Validation failed.",
                "details": error.messages,
            }, 400

    def delete(self, category_id):
        category = db.session.get(
            Category,
            category_id,
        )

        if category is None:
            return {
                "error": "Category not found."
            }, 404

        db.session.delete(category)
        db.session.commit()

        return {
            "message": "Category deleted successfully."
        }, 200


api.add_resource(
    CategoryListResource,
    "",
)

api.add_resource(
    CategoryResource,
    "/<int:category_id>",
)