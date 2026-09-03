import os
import uuid

from flask import Blueprint, current_app, request
from flask_restful import Api, Resource
from werkzeug.utils import secure_filename

from app.extensions import db
from models.item import Item

items_bp = Blueprint("items", __name__, url_prefix="/api/items")
api = Api(items_bp)

ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def _save_image(image_file):
    extension = image_file.filename.rsplit(".", 1)[-1].lower() if "." in image_file.filename else ""

    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        return None, "Image must be a png, jpg, jpeg, gif or webp file"

    filename = secure_filename(f"{uuid.uuid4().hex}.{extension}")
    upload_dir = os.path.join(current_app.root_path, "static", "uploads", "items")
    os.makedirs(upload_dir, exist_ok=True)
    image_file.save(os.path.join(upload_dir, filename))

    image_url = f"{request.host_url.rstrip('/')}/static/uploads/items/{filename}"
    return image_url, None


def _request_data():
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        return request.form.to_dict()

    return request.get_json(silent=True) or {}


def _serialize(item):
    return {
        "id": item.id,
        "ownerId": item.owner_id,
        "name": item.name,
        "description": item.description,
        "image": item.image,
        "categoryId": item.category_id,
        "condition": item.condition,
        "status": item.status,
        "createdAt": item.created_at.isoformat() if item.created_at else None,
        "updatedAt": item.updated_at.isoformat() if item.updated_at else None,
    }


class ItemList(Resource):
    def get(self):
        #returns an item
        query = Item.query

        search = request.args.get("search")
        if search:
            query = query.filter(Item.name.ilike(f"%{search}%"))

        category_id = request.args.get("category_id")
        if category_id:
            query = query.filter(Item.category_id == category_id)

        status = request.args.get("status")
        if status:
            query = query.filter(Item.status == status)

        items = query.order_by(Item.created_at.desc()).all()

        return {"items": [_serialize(item) for item in items]}

    def post(self):
        #adds an item to the system
        data = _request_data()

        name = (data.get("name") or "").strip()
        owner_id = data.get("ownerId")

        missing = []
        if not name:
            missing.append("name")
        if owner_id is None:
            missing.append("ownerId")
        if missing:
            return {
                "message": f"Missing required field(s): {', '.join(missing)}"
            }, 400

        if isinstance(owner_id, bool):
            return {"message": "ownerId must be an integer"}, 400

        try:
            owner_id = int(owner_id)
        except (TypeError, ValueError):
            return {"message": "ownerId must be an integer"}, 400

        image_url = data.get("image")
        image_file = request.files.get("image")
        if image_file and image_file.filename:
            image_url, image_error = _save_image(image_file)
            if image_error:
                return {"message": image_error}, 400

        item = Item(
            name=name,
            owner_id=owner_id,
            description=data.get("description"),
            image=image_url,
            category_id=data.get("categoryId"),
            condition=data.get("condition"),
            status=data.get("status") or "Available",
        )

        db.session.add(item)
        db.session.commit()

        return {"item": _serialize(item)}, 201


api.add_resource(ItemList, "") #/items


class ItemDetail(Resource):
    def get(self, item_id):
        #returns a specific item
        item = Item.query.get(item_id)

        if item is None:
            return {"message": "Item not found"}, 404

        return {"item": _serialize(item)}

    def patch(self, item_id):
        #updates an item in the system.
        item = Item.query.get(item_id)
        if item is None:
            return {"message": "Item not found"}, 404

        data = _request_data()

        if "name" in data:
            name = (data.get("name") or "").strip()
            if not name:
                return {"message": "name cannot be empty"}, 400
            item.name = name

        if "ownerId" in data:
            owner_id = data.get("ownerId")
            if isinstance(owner_id, bool):
                return {"message": "ownerId must be an integer"}, 400
            try:
                owner_id = int(owner_id)
            except (TypeError, ValueError):
                return {"message": "ownerId must be an integer"}, 400
            item.owner_id = owner_id

        if "description" in data:
            item.description = data.get("description")

        image_file = request.files.get("image")
        if image_file and image_file.filename:
            image_url, image_error = _save_image(image_file)
            if image_error:
                return {"message": image_error}, 400
            item.image = image_url
        elif "image" in data:
            item.image = data.get("image")

        if "categoryId" in data:
            item.category_id = data.get("categoryId")

        if "condition" in data:
            item.condition = data.get("condition")

        if "status" in data:
            status = (data.get("status") or "").strip()
            if not status:
                return {"message": "status cannot be empty"}, 400
            item.status = status

        db.session.commit()

        return {"item": _serialize(item)}

    def delete(self, item_id):
        #deletes an item from the system.
        item = Item.query.get(item_id)
        if item is None:
            return {"message": "Item not found"}, 404

        db.session.delete(item)
        db.session.commit()

        return {"message": "Item deleted", "id": item_id}


api.add_resource(ItemDetail, "/<int:item_id>") #/items/<int:item_id>


users_bp = Blueprint("users_items", __name__, url_prefix="/api/users")
users_api = Api(users_bp)


class UserItems(Resource):
    def get(self, user_id):
        items = (
            Item.query.filter(Item.owner_id == user_id)
            .order_by(Item.created_at.desc())
            .all()
        )

        return {"items": [_serialize(item) for item in items]}


users_api.add_resource(UserItems, "/<int:user_id>/items") #/users/<int:user_id>/items
