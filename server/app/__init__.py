from flask import Flask
from flask_restful import Api

from app.config import Config
from routes.auth import auth_bp
from app.extensions import (
    cors,
    db,
    jwt,
    migrate,
    ma,
)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                ],
            },
        },
    )

<<<<<<< HEAD
    # Import models so they are registered with SQLAlchemy
    from models import (
        Item,
        Loan,
        Membership,
        Payment,
        Profile,
        User,
=======
    
    # Load every model so SQLAlchemy and
    # Flask-Migrate can discover them.
    import models  # noqa: F401

    # Import application blueprints.
    from routes import (
        auth_bp,
        borrowing_request_bp,
        items_bp,
        loan_bp,
        membership_bp,
        payment_bp,
        profile_bp,
        user_bp,
        users_bp,
>>>>>>> ce4be8f58662b5e942e1ee34609345f77ec35da6
    )

    # Register routes
    from routes.user_routes import user_bp
    from routes.profile_routes import profile_bp
    from routes.loans_routes import loans_bp
    from routes.borrow_request_routes import borrow_requests_bp

    app.register_blueprint(user_bp)
<<<<<<< HEAD
    app.register_blueprint(profile_bp)
    app.register_blueprint(loans_bp)
    app.register_blueprint(borrow_requests_bp)
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    
=======
    app.register_blueprint(users_bp)
>>>>>>> ce4be8f58662b5e942e1ee34609345f77ec35da6

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": "Neighborly API is running.",
        }, 200

    return app