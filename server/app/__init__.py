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

    # Import models so they're registered with SQLAlchemy before migrations run
    # Import models so they are registered with SQLAlchemy
    from models import (
<<<<<<< HEAD
        #Item,
        #Loan,
        #Membership,
        #Payment,
=======
        Item,
        Loan,
        Membership,
        Payment,
>>>>>>> 95646b29cd6725b7c14f8d5e4181f797d3f8ce53
        Profile,
        User,
    )

    from routes import (
    auth_bp,
    profile_bp,
    user_bp,
)

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(user_bp)

    # Register blueprints
    # Register routes
<<<<<<< HEAD
   

    
=======
    from routes import profile_bp, user_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(profile_bp)
>>>>>>> 95646b29cd6725b7c14f8d5e4181f797d3f8ce53

    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "message": "Neighborly API is running.",
        }, 200

    return app