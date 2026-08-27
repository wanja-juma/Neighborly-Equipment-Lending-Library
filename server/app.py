from flask import Flask
from extensions import db
from borrowing_requests import borrowing_requests_bp

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://henry:yourpassword@localhost/neighborly"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    app.register_blueprint(borrowing_requests_bp)
    return app
