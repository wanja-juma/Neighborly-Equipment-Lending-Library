from sqlalchemy.orm import validates

from app.extensions import db


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

    @validates(
        "first_name",
        "last_name",
    )
    def validate_name(
        self,
        key,
        value,
    ):
        if not value or not value.strip():
            raise ValueError(
                f"{key} is required."
            )

        return value.strip()