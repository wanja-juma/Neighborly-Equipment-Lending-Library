from datetime import datetime, timezone
from app.extensions import db


class BorrowingRequest(db.Model):
    __tablename__ = "borrowing_requests"

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    status = db.Column(db.String(20), nullable=False, default="pending")
    notification = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    item = db.relationship("Item", backref="borrowing_requests")
    borrower = db.relationship("User", backref="borrowing_requests")

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "borrower_id": self.borrower_id,
            "owner_id": self.item.owner_id if self.item else None,
            "status": self.status,
            "notification": self.notification,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
