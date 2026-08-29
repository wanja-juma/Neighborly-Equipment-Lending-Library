from datetime import datetime, timezone
from app.extensions import db

class Loan(db.Model):
    __tablename__ = 'loans'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    borrower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='Active')

    # Relationships
    item = db.relationship('Item', back_populates='loans')
    borrower = db.relationship('User', backref='loans')
    payments = db.relationship('Payment', back_populates='loan', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Loan {self.id}>'