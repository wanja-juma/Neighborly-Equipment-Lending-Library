import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///neighborly.db",
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "neighborly-local-development-secret",
    )

    # Required for Flask-RESTful: without this, Flask-RESTful intercepts
    # exceptions (like Flask-JWT-Extended auth errors) before Flask's own
    # registered error handlers get a chance to produce a clean response.
    PROPAGATE_EXCEPTIONS = True