from datetime import datetime, timezone
from sqlalchemy.orm import validates

from werkzeug.security import (
    check_password_hash,
    generate_password_hash,
)

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    name = db.Column(
        db.String(100),
        nullable=False,
    )

    address = db.Column(
        db.String(255),
        nullable=False,
    )

    phone_number = db.Column(
        db.String(20),
        unique=True,
        nullable=False,
        index=True,
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False,
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(
            timezone.utc
        ),
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(
            timezone.utc
        ),
        onupdate=lambda: datetime.now(
            timezone.utc
        ),
    )

    @property
    def password(self):
        raise AttributeError(
            "Password cannot be read."
        )

    @password.setter
    def password(self, plain_password):
        self.set_password(plain_password)

    def set_password(self, plain_password):
        if not plain_password:
            raise ValueError(
                "Password is required."
            )

        if len(plain_password) < 8:
            raise ValueError(
                "Password must contain at least "
                "8 characters."
            )

        self.password_hash = (
            generate_password_hash(
                plain_password
            )
        )

    def check_password(self, plain_password):
        if not self.password_hash:
            return False

        return check_password_hash(
            self.password_hash,
            plain_password,
        )

    @validates("name")
def validate_name(self, key, value):
    if not value or not value.strip():
        raise ValueError(
            "Name is required."
        )

    return value.strip()


@validates("address")
def validate_address(self, key, value):
    if not value or not value.strip():
        raise ValueError(
            "Address is required."
        )

    return value.strip()


@validates("email")
def validate_email(self, key, value):
    if not value:
        raise ValueError(
            "Email is required."
        )

    normalized_email = (
        value.strip().lower()
    )

    if (
        "@" not in normalized_email
        or "." not in normalized_email
        .split("@")[-1]
    ):
        raise ValueError(
            "A valid email is required."
        )

    return normalized_email


@validates("phone_number")
def validate_phone_number(
    self,
    key,
    value,
):
    if not value or not value.strip():
        raise ValueError(
            "Phone number is required."
        )

    normalized_phone = (
        value.strip()
        .replace(" ", "")
        .replace("-", "")
    )

    digits = normalized_phone.lstrip("+")

    if not digits.isdigit():
        raise ValueError(
            "Phone number contains invalid "
            "characters."
        )

    if not 9 <= len(digits) <= 15:
        raise ValueError(
            "Phone number must contain "
            "between 9 and 15 digits."
        )

    return normalized_phone

def to_dict(self):
    return {
        "id": self.id,
        "name": self.name,
        "address": self.address,
        "phone_number": self.phone_number,
        "email": self.email,
        "created_at": (
            self.created_at.isoformat()
            if self.created_at
            else None
        ),
        "updated_at": (
            self.updated_at.isoformat()
            if self.updated_at
            else None
        ),
    }


    def __repr__(self):
        return (
            f"<User {self.id}: "
            f"{self.email}>"
        )