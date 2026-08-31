from flask import Flask

from app.config import Config
from app.extensions import (
    cors,
    db,
    jwt,
    ma,
    migrate,
)


def create_app(config_class=Config):
    app = Flask(__name__)

    app.config.from_object(config_class)

    # Initialize Flask extensions.
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    # Allow the React frontend to access backend API routes.
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                ],
                "methods": [
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE",
                    "OPTIONS",
                ],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                ],
            },
        },
    )

    # Import models so SQLAlchemy and Flask-Migrate
    # can discover them.
    import models  # noqa: F401

    # Import blueprints after extensions/models are initialized.
    from routes import (
        auth_bp,
        borrowing_request_bp,
        item_bp,
        loan_bp,
        membership_bp,
        payment_bp,
        profile_bp,
        user_bp,
    )

    # Register each blueprint exactly once.
    app.register_blueprint(auth_bp)
    from routes import (
    auth_bp,
    profile_bp,
    user_bp,
)

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(user_bp)

    # Register blueprints
    from routes import profile_bp, user_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(item_bp)
    app.register_blueprint(borrowing_request_bp)
    app.register_blueprint(loan_bp)
    app.register_blueprint(membership_bp)
    app.register_blueprint(payment_bp)

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": "Neighborly API is running.",
        }, 200

    return app