from marshmallow import (
    fields,
    validate,
)
from marshmallow_sqlalchemy import (
    SQLAlchemyAutoSchema,
)

from models.borrow_request import (
    BorrowingRequest,
)


class BorrowingRequestSchema(
    SQLAlchemyAutoSchema
):

    class Meta:
        model = BorrowingRequest
        load_instance = True
        include_fk = True 

    id = fields.Int(
        dump_only=True
    )

    loan_id = fields.Int(
        dump_only=True,
        allow_none=True
    )

    # The logged-in user is assigned
    # by the backend, not trusted from
    # the frontend.
    user_id = fields.Int(
        dump_only=True
    )

    equipment_id = fields.Int(
        required=True
    )

    start_date = fields.DateTime(
        required=True
    )

    end_date = fields.DateTime(
        required=True
    )

    request_date = fields.DateTime(
        dump_only=True
    )

    created_at = fields.DateTime(
        dump_only=True
    )

    status = fields.Str(
        validate=validate.OneOf([
            "pending",
            "approved",
            "declined",
            "rejected",
            "cancelled",
        ]),
        load_default="pending"
    )
    start_date = fields.DateTime(required=True)
    end_date = fields.DateTime(required=True)
    message = fields.Str(
        allow_none=True
    )

    # Extra frontend-friendly data.
    item = fields.Method(
        "get_item",
        dump_only=True
    )

    borrower = fields.Method(
        "get_borrower",
        dump_only=True
    )

    owner_id = fields.Method(
        "get_owner_id",
        dump_only=True
    )


    def get_item(
        self,
        borrowing_request
    ):
        item = getattr(
            borrowing_request,
            "item",
            None
        )

        if item is None:
            return None

        return {
            "id": item.id,
            "name": item.name,
            "description":
                item.description,
            "condition":
                item.condition,
            "status":
                item.status,
            "owner_id":
                item.owner_id,
            "category_id":
                item.category_id,
            "image":
                item.image,
        }


    def get_owner_id(
        self,
        borrowing_request
    ):
        item = getattr(
            borrowing_request,
            "item",
            None
        )

        if item is None:
            return None

        return item.owner_id


    def get_borrower(
        self,
        borrowing_request
    ):
        user = getattr(
            borrowing_request,
            "user",
            None
        )

        if user is None:
            return None

        profile = getattr(
            user,
            "profile",
            None
        )

        first_name = ""
        last_name = ""

        if profile:
            first_name = (
                profile.first_name or ""
            )

            last_name = (
                profile.last_name or ""
            )

        full_name = " ".join(
            [
                first_name,
                last_name,
            ]
        ).strip()

        return {
            "id": user.id,
            "email": user.email,
            "name":
                full_name
                or "Neighbour",
            "first_name":
                first_name,
            "last_name":
                last_name,
        }


borrowing_request_schema = (
    BorrowingRequestSchema()
)

borrowing_requests_schema = (
    BorrowingRequestSchema(
        many=True
    )
)