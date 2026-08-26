from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Loan(db.Model):
    __tablename__ = 'loan'

    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('borrowing_request.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    status = db.Column(db.String, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    returned_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    
    borrowing_request = db.relationship('BorrowingRequest', backref='loan', uselist=False)
    item = db.relationship('Item', backref='loans')
    owner = db.relationship('User', foreign_keys=[owner_id], backref='loans_as_owner')
    borrower = db.relationship('User', foreign_keys=[borrower_id], backref='loans_as_borrower')