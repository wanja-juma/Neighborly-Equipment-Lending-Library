from datetime import (
    datetime,
    timezone,
)

from flask import (
    Blueprint,
    jsonify,
    request,
)

from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)

from marshmallow import (
    ValidationError,
)

from sqlalchemy import or_

from app.extensions import db

from models.borrow_request import (
    BorrowingRequest,
)

from models.loans import Loan
from models.item import Item

from schemas.borrow_request_schema import (
    borrowing_request_schema,
    borrowing_requests_schema,
)


borrow_requests_bp = Blueprint(
    "borrow_requests",
    __name__,
    url_prefix="/api/borrowing-requests",
)


@borrow_requests_bp.get("")
@jwt_required()
def get_borrowing_requests():
    """
    Return requests relevant to the
    logged-in user.

    Outgoing:
        user created the request.

    Incoming:
        user owns the requested item.
    """

    current_user_id = int(
        get_jwt_identity()
    )

    borrowing_requests = (
        BorrowingRequest.query
        .join(
            Item,
            BorrowingRequest.equipment_id
            == Item.id
        )
        .filter(
            or_(
                BorrowingRequest.user_id
                == current_user_id,

                Item.owner_id
                == current_user_id,
            )
        )
        .order_by(
            BorrowingRequest.created_at.desc()
        )
        .all()
    )

    return jsonify({
        "borrowing_requests":
            borrowing_requests_schema.dump(
                borrowing_requests
            )
    }), 200


@borrow_requests_bp.post("")
@jwt_required()
def create_borrowing_request():
    """
    Create a borrowing request for
    the currently logged-in user.
    """

    current_user_id = int(
        get_jwt_identity()
    )

    json_data = request.get_json(
        silent=True
    )

    if not json_data:
        return jsonify({
            "error":
                "Request body is required."
        }), 400

    try:
        borrowing_request = (
            borrowing_request_schema.load(
                json_data,
                session=db.session
            )
        )

        item = db.session.get(
            Item,
            borrowing_request.equipment_id
        )

        if item is None:
            return jsonify({
                "error":
                    "Item not found."
            }), 404

        # Prevent owners from borrowing
        # their own item.
        if (
            int(item.owner_id)
            == current_user_id
        ):
            return jsonify({
                "error":
                    "You cannot request your own item."
            }), 400

        # Assign borrower from JWT.
        borrowing_request.user_id = (
            current_user_id
        )

        borrowing_request.status = (
            "pending"
        )

        db.session.add(
            borrowing_request
        )

        db.session.commit()

        return jsonify({
            "borrowing_request":
                borrowing_request_schema.dump(
                    borrowing_request
                )
        }), 201

    except ValidationError as error:
        db.session.rollback()

        return jsonify({
            "error":
                "Validation failed.",
            "details":
                error.messages,
        }), 400

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "error":
                "Unable to create borrowing request.",
            "details":
                str(error),
        }), 500


@borrow_requests_bp.get(
    "/<int:request_id>"
)
@jwt_required()
def get_borrowing_request(
    request_id
):
    """
    Get one request only if the
    current user sent it or owns
    the requested item.
    """

    current_user_id = int(
        get_jwt_identity()
    )

    borrowing_request = (
        db.session.get(
            BorrowingRequest,
            request_id
        )
    )

    if borrowing_request is None:
        return jsonify({
            "error":
                "Borrowing request not found."
        }), 404

    item = db.session.get(
        Item,
        borrowing_request.equipment_id
    )

    is_borrower = (
        borrowing_request.user_id
        == current_user_id
    )

    is_owner = (
        item is not None
        and item.owner_id
        == current_user_id
    )

    if not (
        is_borrower
        or is_owner
    ):
        return jsonify({
            "error":
                "You are not authorized to view this request."
        }), 403

    return jsonify({
        "borrowing_request":
            borrowing_request_schema.dump(
                borrowing_request
            )
    }), 200


@borrow_requests_bp.patch(
    "/<int:request_id>"
)
@jwt_required()
def update_borrowing_request(
    request_id
):
    """
    Update a borrowing request.

    Item owner:
        approve / decline.

    Borrower:
        cancel.

    Approval automatically creates
    a Loan.
    """

    current_user_id = int(
        get_jwt_identity()
    )

    borrowing_request = (
        db.session.get(
            BorrowingRequest,
            request_id
        )
    )

    if borrowing_request is None:
        return jsonify({
            "error":
                "Borrowing request not found."
        }), 404

    item = db.session.get(
        Item,
        borrowing_request.equipment_id
    )

    if item is None:
        return jsonify({
            "error":
                "Requested item not found."
        }), 404

    json_data = request.get_json(
        silent=True
    )

    if not json_data:
        return jsonify({
            "error":
                "Request body is required."
        }), 400

    requested_status = str(
        json_data.get(
            "status",
            borrowing_request.status
        )
    ).lower()

    is_owner = (
        int(item.owner_id)
        == current_user_id
    )

    is_borrower = (
        int(
            borrowing_request.user_id
        )
        == current_user_id
    )

    # Only the owner can approve
    # or decline a request.
    if requested_status in [
        "approved",
        "declined",
        "rejected",
    ]:
        if not is_owner:
            return jsonify({
                "error":
                    "Only the item owner can approve or decline this request."
            }), 403

    # Only the borrower can cancel
    # their request.
    if (
        requested_status
        == "cancelled"
        and not is_borrower
    ):
        return jsonify({
            "error":
                "Only the borrower can cancel this request."
        }), 403

    try:
        updated_request = (
            borrowing_request_schema.load(
                json_data,
                instance=borrowing_request,
                partial=True,
                session=db.session
            )
        )

        new_status = str(
            updated_request.status
            or ""
        ).lower()

        # Normalize rejected to declined
        # so the frontend sees one value.
        if new_status == "rejected":
            updated_request.status = (
                "declined"
            )

            new_status = "declined"

        if (
            new_status == "approved"
            and
            updated_request.loan_id
            is None
        ):
            loan = Loan(
                item_id=(
                    updated_request
                    .equipment_id
                ),
                borrower_id=(
                    updated_request
                    .user_id
                ),
                start_date=(
                    updated_request
                    .start_date
                ),
                end_date=(
                    updated_request
                    .end_date
                ),
                approved_at=(
                    datetime.now(
                        timezone.utc
                    )
                ),
                status="Active",
            )

            db.session.add(loan)

            db.session.flush()

            updated_request.loan_id = (
                loan.id
            )

        db.session.commit()

        return jsonify({
            "borrowing_request":
                borrowing_request_schema.dump(
                    updated_request
                )
        }), 200

        db.session.commit()
        return jsonify({"borrowing_request": borrowing_request_schema.dump(updated_request)}), 200
    except ValidationError as error:
        db.session.rollback()

        return jsonify({
            "error":
                "Validation failed.",
            "details":
                error.messages,
        }), 400

    except Exception as error:
        db.session.rollback()

        return jsonify({
            "error":
                "Unable to update borrowing request.",
            "details":
                str(error),
        }), 500


@borrow_requests_bp.delete(
    "/<int:request_id>"
)
@jwt_required()
def delete_borrowing_request(
    request_id
):
    """
    Delete a borrowing request.

    Only the borrower who created
    the request can delete it.
    """

    current_user_id = int(
        get_jwt_identity()
    )

    borrowing_request = (
        db.session.get(
            BorrowingRequest,
            request_id
        )
    )

    if borrowing_request is None:
        return jsonify({
            "error":
                "Borrowing request not found."
        }), 404

    if (
        int(
            borrowing_request.user_id
        )
        != current_user_id
    ):
        return jsonify({
            "error":
                "You are not authorized to delete this request."
        }), 403

    db.session.delete(
        borrowing_request
    )

    db.session.commit()

    return jsonify({
        "message":
            "Borrowing request deleted successfully"
    }), 200
