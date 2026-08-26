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
