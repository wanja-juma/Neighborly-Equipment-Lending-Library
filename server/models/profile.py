from app.extensions import db
from sqlalchemy.orm import validates


class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    first_name = db.Column(
        db.String(100),
        nullable=False,
    )

    last_name = db.Column(
        db.String(100),
        nullable=False,
    )

    phone_number = db.Column(
        db.String(20),
        unique=True,
        nullable=True,
    )

    address = db.Column(
        db.String(255),
        nullable=True,
    )

    avatar_url = db.Column(
        db.String(500),
        nullable=True,
    )

    bio = db.Column(
        db.Text,
        nullable=True,
    )

    user = db.relationship(
        "User",
        back_populates="profile",
    )

    @validates("first_name", "last_name")
    def validate_name(self, key, value):
            field_name = key.replace("_", " ").title()

            if not value or not value.strip():
                raise ValueError(
                f"{field_name} is required."
            )

            return value.strip()

    @validates("phone_number")
    def validate_phone_number(self, key, value):
            if value is None or not value.strip():
                return None

            normalized_phone = (
            value.strip()
            .replace(" ", "")
            .replace("-", "")
        )

            if normalized_phone.startswith("+"):
                digits = normalized_phone[1:]
            else:
                digits = normalized_phone

            if not digits.isdigit():
                raise ValueError(
            "Phone number must contain only digits "
            "and an optional leading plus sign."
        )

            if not 9 <= len(digits) <= 15:
                raise ValueError(
            "Phone number must contain between "
            "9 and 15 digits."
        )

            return normalized_phone


    @validates("address", "bio")
    def clean_optional_text(self, key, value):
        if value is None or not value.strip():
            return None

        return value.strip()

    def __repr__(self):
        return (
            f"<Profile {self.id}: "
            f"{self.first_name} {self.last_name}>"
        )