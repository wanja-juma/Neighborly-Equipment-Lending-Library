from routes.auth import auth_bp
from .item import items_bp

from routes.borrow_request_routes import (
    borrow_requests_bp,
)

from routes.categories_routes import (
    categories_bp,
)

from routes.damage_reports_routes import (
    damage_reports_bp,
)

from routes.loans_routes import (
    loans_bp,
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


__all__ = [
    "auth_bp",
    "borrow_requests_bp",
    "categories_bp",
    "damage_reports_bp",
    "loans_bp",
    "membership_bp",
    "payment_bp",
    "profile_bp",
    "user_bp",
]