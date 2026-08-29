from datetime import datetime, timezone
from app.extensions import db


class BorrowingRequest(db.Model):
    __tablename__ = "borrowing_requests"

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey("loans.id", ondelete="CASCADE"), nullable=False)

    status = db.Column(db.String(20), nullable=False, default="pending")
    notification = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
