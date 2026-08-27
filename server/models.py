from datetime import datetime
from extensions import db


class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer)
    condition = db.Column(db.String(50))
    status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BorrowingRequest(db.Model):
    __tablename__ = "borrowing_requests"

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    status = db.Column(db.String(20), nullable=False, default="pending")
    notification = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    item = db.relationship("Item", backref="borrowing_requests")
    borrower = db.relationship("User", backref="borrowing_requests")

    def owner(self):
        return self.item.owner_id if self.item else None

    def to_dict(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "borrower_id": self.borrower_id,
            "owner_id": self.owner(),
            "status": self.status,
            "notification": self.notification,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
