from datetime import datetime
from app.extensions import db

class BorrowingRequest(db.Model):
    __tablename__ = 'borrowing_requests'

    id = db.Column(db.Integer, primary_key=True)
    loan_id = db.Column(db.Integer, db.ForeignKey('loans.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    notification = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)