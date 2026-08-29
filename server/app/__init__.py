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
    )

    # Register every blueprint exactly once.
    app.register_blueprint(auth_bp)
    app.register_blueprint(
        borrowing_request_bp
    )
    app.register_blueprint(items_bp)
    app.register_blueprint(loan_bp)
    app.register_blueprint(membership_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(user_bp)

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": (
                "Neighborly API is running."
            ),
        }, 200

    return app