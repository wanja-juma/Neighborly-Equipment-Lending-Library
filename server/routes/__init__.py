from routes.profile_routes import profile_bp
from routes.user_routes import user_bp
from routes.borrowing_requests import borrowing_requests_bp

__all__ = [
    "user_bp",
    "profile_bp",
    "borrowing_requests_bp",
]
