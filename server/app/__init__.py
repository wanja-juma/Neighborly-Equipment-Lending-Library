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
                ]
            }
        },
    )

    # Import models so they are registered with SQLAlchemy and Flask-Migrate
    from models import (
        Item,
        Loan,
        Membership,
        Payment,
        Profile,
        User,
    )
    import models  # noqa: F401

    # Import application blueprints
    from routes import (
        auth_bp,
        borrow_requests_bp,
        items_bp,
        loans_bp,
        membership_bp,
        payment_bp,
        profile_bp,
        user_bp,
        users_bp,
    )

    # Register every blueprint exactly once
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(borrow_requests_bp, url_prefix='/api')
    app.register_blueprint(items_bp)
    app.register_blueprint(loans_bp)
    app.register_blueprint(membership_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(users_bp)

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": "Neighborly API is running.",
        }, 200

    return app