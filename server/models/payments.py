from extentions import db

VALID_STATUSES = ('held', 'refunded', 'forfeited')

class payments(db.Model):
    __tablename__ = 'payments'
 
 
    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=False, unique=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String, nullable=False, default='held')
    paid_at = db.Column(db.DateTime)
    refunded_at = db.Column(db.DateTime) 
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())   

    loan = db.relationship('Loan', back_populates='paymeants')