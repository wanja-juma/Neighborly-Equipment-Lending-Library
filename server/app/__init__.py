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

    # Import models so they are registered with SQLAlchemy
    from models import (
        Item,
        Loan,
        Membership,
        Payment,
        Profile,
        User,
    )

    # Register routes
    from routes.user_routes import user_bp
    from routes.profile_routes import profile_bp
    from routes.loans_routes import loans_bp
    from routes.borrow_request_routes import borrow_requests_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(loans_bp)
    app.register_blueprint(borrow_requests_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": "Neighborly API is running.",
        }, 200

    return app
