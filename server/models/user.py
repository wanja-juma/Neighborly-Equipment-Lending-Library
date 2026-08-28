from datetime import datetime, timezone
from sqlalchemy.orm import validates

from werkzeug.security import (
    check_password_hash,
    generate_password_hash,
)

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False, index=True)

    password_hash = db.Column(db.String(255), nullable=False)

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    profile = db.relationship(
        "Profile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    memberships = db.relationship(
        "Membership",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    @validates("email")
    def validate_email(self, key, value):
        if not value or not value.strip():
            raise ValueError("Email is required.")

        normalized_email = value.strip().lower()

        if "@" not in normalized_email or "." not in normalized_email.split("@")[-1]:
            raise ValueError("A valid email is required.")

        return normalized_email

    @property
    def password(self):
        raise AttributeError("Password cannot be read.")

    @password.setter
    def password(self, plain_password):
        self.set_password(plain_password)

    def set_password(self, plain_password):
        if not plain_password:
            raise ValueError("Password is required.")

        if len(plain_password) < 8:
            raise ValueError("Password must contain at least 8 characters.")

        self.password_hash = generate_password_hash(plain_password)

    def check_password(self, plain_password):
        if not self.password_hash:
            return False

        return check_password_hash(self.password_hash, plain_password)

    def __repr__(self):
        return f"<User {self.id}: {self.email}>"