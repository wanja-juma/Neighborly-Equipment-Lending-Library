from datetime import (
    datetime,
    timezone,
)

from sqlalchemy.orm import validates

from app.extensions import db


VALID_REQUEST_STATUSES = {
    "pending",
    "approved",
    "declined",
    "cancelled",
}


class BorrowingRequest(db.Model):
    __tablename__ = (
        "borrowing_requests"
    )

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    loan_id = db.Column(
        db.Integer,
        db.ForeignKey("loans.id"),
        nullable=False,
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="pending",
    )

    notification = db.Column(
        db.String(255),
        nullable=True,
    )

    created_at = db.Column(
        db.DateTime,
        nullable=True,
        default=lambda: datetime.now(
            timezone.utc
        ),
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=True,
        default=lambda: datetime.now(
            timezone.utc
        ),
        onupdate=lambda: datetime.now(
            timezone.utc
        ),
    )

    loan = db.relationship(
        "Loan",
        backref=db.backref(
            "borrowing_requests",
            cascade="all, delete-orphan",
        ),
    )

    @property
    def user(self):
        if self.loan is None:
            return None

        return self.loan.borrower

    @property
    def item(self):
        if self.loan is None:
            return None

        return self.loan.item

    @validates("status")
    def validate_status(
        self,
        key,
        value,
    ):
        normalized_status = (
            str(value).strip().lower()
        )

        if (
            normalized_status
            not in VALID_REQUEST_STATUSES
        ):
            raise ValueError(
                "Status must be pending, "
                "approved, declined, "
                "or cancelled."
            )

        return normalized_status

    def __repr__(self):
        return (
            f"<BorrowingRequest "
            f"{self.id}: "
            f"{self.status}>"
        )