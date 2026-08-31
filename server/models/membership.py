from sqlalchemy.orm import validates

from app.extensions import db

VALID_STATUSES = ('active', 'inactive', 'suspended')


class Membership(db.Model):
    __tablename__ = 'memberships'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String, nullable=False, default='active')
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    user = db.relationship('User', backref='memberships')

    @validates('status')
    def validate_status(self, key, value):
        if value not in VALID_STATUSES:
            raise ValueError(
                f"Status must be one of {VALID_STATUSES}."
            )

        return value

    @validates('end_date')
    def validate_end_date(self, key, value):
        if value is not None and self.start_date is not None and value < self.start_date:
            raise ValueError(
                "End date cannot be before start date."
            )

        return value

    def __repr__(self):
        return f"<Membership {self.id}: user {self.user_id}, {self.status}>"