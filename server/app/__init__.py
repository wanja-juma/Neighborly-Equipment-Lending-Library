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

    # Load application configuration.
    app.config.from_object(config_class)

    # Initialize Flask extensions.
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    # Allow the React frontend to access
    # backend API routes.
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

    # Import models so SQLAlchemy and
    # Flask-Migrate can discover them.
    import models  # noqa: F401

    # Import blueprints after extensions
    # have been initialized.
    from routes.auth import auth_bp

    from routes.borrow_request_routes import (
        borrow_requests_bp,
    )

    from routes.membership_routes import (
        membership_bp,
    )

    from routes.payments_routes import (
        payment_bp,
    )

    from routes.profile_routes import (
        profile_bp,
    )

    from routes.user_routes import (
        user_bp,
    )

    # Register each blueprint once.
    app.register_blueprint(auth_bp)

    app.register_blueprint(
        user_bp
    )

    app.register_blueprint(
        profile_bp
    )

    app.register_blueprint(
        borrow_requests_bp
    )

    app.register_blueprint(
        membership_bp
    )

    app.register_blueprint(
        payment_bp
    )

    # Health check route.
    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": (
                "Neighborly API is running."
            ),
        }, 200

    return app