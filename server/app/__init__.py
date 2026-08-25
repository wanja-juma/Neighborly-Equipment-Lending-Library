from flask import Flask

from app.config import Config
from app.extensions import (
    cors,
    db,
    jwt,
    migrate,
)


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

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

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": (
                "Neighborly API is running."
            ),
        }, 200

    return app