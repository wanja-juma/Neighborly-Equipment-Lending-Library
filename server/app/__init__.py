from flask import Flask
from flask_cors import CORS
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
                    "http://localhost:5174",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:5174",
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
                "supports_credentials": True
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
    damage_reports_bp,
    loans_bp,
    membership_bp,
    payment_bp,
    profile_bp,
    user_bp,
    items_bp,
)

    # Register each blueprint once.
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(borrow_requests_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(damage_reports_bp)
    app.register_blueprint(loans_bp)
    app.register_blueprint(membership_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(items_bp)

    # Health check route.
    @app.get("/api/health")
    def health_check():
        return {
        "status": "healthy",
        "message": (
            "Neighborly API is running."
        ),
    }, 200

    # Temporary test seeder route for mock assumptions
    @app.get("/api/seed-test-data")
    def seed_test_data():
        from models.user import User
        from models.borrow_request import BorrowingRequest
        from models.loans import Loan

        # Check if test users exist by email
        owner = User.query.filter_by(email='owner@neighborly.com').first()
        if not owner:
            owner = User(email='owner@neighborly.com')
            owner.password = 'password123'
            db.session.add(owner)

        borrower = User.query.filter_by(email='borrower@neighborly.com').first()
        if not borrower:
            borrower = User(email='borrower@neighborly.com')
            borrower.password = 'password123'
            db.session.add(borrower)
        
        db.session.commit()
        return {"message": "Test environment ready!"}, 200

    

    return app