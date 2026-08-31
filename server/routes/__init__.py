from routes.auth import auth_bp

from routes.borrow_request_routes import (
    borrow_requests_bp as borrowing_request_bp,
)

from routes.items_routes import (
    item_bp,
)

from routes.loans_routes import (
    loan_bp,
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
from routes.profile_routes import profile_bp
from routes.user_routes import user_bp


__all__ = [
    "auth_bp",
    "borrowing_request_bp",
    "item_bp",
    "loan_bp",
    "membership_bp",
    "payment_bp",
    "profile_bp",
    "user_bp",
]