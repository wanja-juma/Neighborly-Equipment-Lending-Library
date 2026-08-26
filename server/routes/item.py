from flask import Blueprint, jsonify, request

from extensions import db
from models.item import Item

items_bp = Blueprint("items", __name__, url_prefix="/api/items")


def _serialize(item):
    return {
        "id": item.id,
        "ownerId": item.owner_id,
        "name": item.name,
        "description": item.description,
        "categoryId": item.category_id,
        "condition": item.condition,
        "status": item.status,
        "createdAt": item.created_at.isoformat() if item.created_at else None,
        "updatedAt": item.updated_at.isoformat() if item.updated_at else None,
    }


@items_bp.get("")
def list_items():
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

    return jsonify({"items": [_serialize(item) for item in items]})


@items_bp.get("/<int:item_id>")
def get_item(item_id):
    item = Item.query.get(item_id)

    if item is None:
        return jsonify({"message": "Item not found"}), 404

    return jsonify({"item": _serialize(item)})


@items_bp.post("")
def create_item():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    owner_id = data.get("ownerId")

    missing = []
    if not name:
        missing.append("name")
    if owner_id is None:
        missing.append("ownerId")
    if missing:
        return (
            jsonify({"message": f"Missing required field(s): {', '.join(missing)}"}),
            400,
        )

    if not isinstance(owner_id, int) or isinstance(owner_id, bool):
        return jsonify({"message": "ownerId must be an integer"}), 400

    item = Item(
        name=name,
        owner_id=owner_id,
        description=data.get("description"),
        category_id=data.get("categoryId"),
        condition=data.get("condition"),
        status=data.get("status") or "Available",
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"item": _serialize(item)}), 201


@items_bp.patch("/<int:item_id>")
def update_item(item_id):
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({"message": "Item not found"}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        name = (data.get("name") or "").strip()
        if not name:
            return jsonify({"message": "name cannot be empty"}), 400
        item.name = name

    if "ownerId" in data:
        owner_id = data.get("ownerId")
        if not isinstance(owner_id, int) or isinstance(owner_id, bool):
            return jsonify({"message": "ownerId must be an integer"}), 400
        item.owner_id = owner_id

    if "description" in data:
        item.description = data.get("description")

    if "categoryId" in data:
        item.category_id = data.get("categoryId")

    if "condition" in data:
        item.condition = data.get("condition")

    if "status" in data:
        status = (data.get("status") or "").strip()
        if not status:
            return jsonify({"message": "status cannot be empty"}), 400
        item.status = status

    db.session.commit()

    return jsonify({"item": _serialize(item)})


@items_bp.delete("/<int:item_id>")
def delete_item(item_id):
    item = Item.query.get(item_id)
    if item is None:
        return jsonify({"message": "Item not found"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item deleted", "id": item_id})


# "My listings" lives under /users, not /items, so it gets its own blueprint.
# Whoever wires up the Flask app needs to register this alongside items_bp.
users_bp = Blueprint("users_items", __name__, url_prefix="/api/users")


@users_bp.get("/<int:user_id>/items")
def get_user_items(user_id):
    items = (
        Item.query.filter(Item.owner_id == user_id)
        .order_by(Item.created_at.desc())
        .all()
    )

    return jsonify({"items": [_serialize(item) for item in items]})
