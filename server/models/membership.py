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

    user = db.relationship('User', back_populates='memberships')



 
 
