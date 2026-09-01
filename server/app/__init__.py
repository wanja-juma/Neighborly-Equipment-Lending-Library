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

    # Import models 
    
    import models 

    # Import blueprints after extensions
   
    from routes import (
    auth_bp,
    borrow_requests_bp,
    categories_bp,
    loans_bp,
    membership_bp,
    payment_bp,
    profile_bp,
    user_bp,
)

    # Register each blueprint once.
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(borrow_requests_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(loans_bp)
    app.register_blueprint(membership_bp)
    app.register_blueprint(payment_bp)

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