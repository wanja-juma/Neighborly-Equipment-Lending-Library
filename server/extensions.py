from flask_sqlalchemy import SQLAlchemy

# Shared SQLAlchemy instance. Imported by models and by the Flask app
# factory (db.init_app(app)) to avoid circular imports.
db = SQLAlchemy()
