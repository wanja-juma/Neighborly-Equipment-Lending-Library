from datetime import datetime, timezone

from app.extensions import db


class BorrowingRequest(db.Model):
    __tablename__ = "borrowing_requests"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    equipment_id = db.Column(
        db.Integer,
        db.ForeignKey("items.id"),
        nullable=False
    )

    request_date = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default="pending",
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=True
    )

    user = db.relationship(
        "User",
        backref="borrowing_requests"
    )

    item = db.relationship(
        "Item",
        backref="borrowing_requests"
    )

    def __repr__(self):
        return f"<BorrowingRequest {self.id}>"