from flask import Flask

from app.config import Config
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

    # Import models so they're registered with SQLAlchemy before migrations run
    from models import (
        Item,
        Loan,
        Membership,
        Payment,
        Profile,
        User,
        BorrowingRequest,
    )

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

    # Register blueprints
    from routes import profile_bp, user_bp, borrowing_requests_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(borrowing_requests_bp)

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": "Neighborly API is running.",
        }, 200

    return app
