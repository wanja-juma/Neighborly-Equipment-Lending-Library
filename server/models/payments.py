from sqlalchemy.orm import validates
from app.extensions import db
from sqlalchemy import func

VALID_STATUSES = ('held', 'refunded', 'forfeited')

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=False, unique=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String, nullable=False, default='held')
    paid_at = db.Column(db.DateTime)
    refunded_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # FIXED LINE 20: changed 'payment' to 'payments' to match Loan.payments
<<<<<<< HEAD
    loan = db.relationship('Loan', back_populates='payment')
=======
    loan = db.relationship('Loan', back_populates='payments')
>>>>>>> ebe99d5140718ab0a26d6c0ce4f2277a0394f3f5

    @validates('status')
    def validate_status(self, key, value):
        if value not in VALID_STATUSES:
            raise ValueError(
                f"Status must be one of {VALID_STATUSES}."
            )
        return value

    @validates('amount')
    def validate_amount(self, key, value):
        if value is not None and value < 0:
            raise ValueError(
                "Amount cannot be negative."
            )
        return value

    def __repr__(self):
        return f"<Payment {self.id}: loan {self.loan_id}, {self.amount}, {self.status}>"