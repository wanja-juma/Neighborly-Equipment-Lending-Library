from datetime import datetime, timezone

from app.extensions import db


class DamageReport(db.Model):
    __tablename__ = "damage_reports"

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(
        db.Integer,
        db.ForeignKey("loans.id"),
        nullable=False
    )
    status = db.Column(db.String(50), nullable=False, default="pending")
    notes = db.Column(db.Text)
    severity = db.Column(db.String(50))
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )
    resolved_at = db.Column(db.DateTime, nullable=True)
    item_image = db.Column(db.String(500))

    loan = db.relationship("Loan", backref="damage_reports")