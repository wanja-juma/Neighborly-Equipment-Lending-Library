from flask import Blueprint, jsonify, request

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
