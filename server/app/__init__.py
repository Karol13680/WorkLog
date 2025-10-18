from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app(config_object=None):
    app = Flask(__name__, instance_relative_config=False)

    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:///database.db',
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if config_object:
        app.config.from_object(config_object)

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from .routes import register_routes
        register_routes(app)

    return app
