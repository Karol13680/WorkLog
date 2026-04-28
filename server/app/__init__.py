import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from app.database.db import db

load_dotenv()

def create_app():
    static_dir = os.path.join(os.getcwd(), 'static')
    
    app = Flask(__name__, 
                instance_relative_config=False,
                static_folder=static_dir,
                static_url_path='')
    
    uri = os.environ.get('DATABASE_URL')
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY') or 'dev_key',
        SQLALCHEMY_DATABASE_URI=uri,
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    db.init_app(app)
    Migrate(app, db)

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173", "http://localhost:5000"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    from .routes import register_routes
    register_routes(app)

    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

    with app.app_context():
        from app.models.users import User
        from app.models.jobs import Job
        from app.models.priorities import Priority
        from app.models.status import Status
        from app.models.job_titles import JobTitle
        from app.models.clients import Client
        from app.models.contacts import Contact
        from app.models.links import Link
        from app.models.links_type import LinkType
        from app.models.logs import Log
        
        db.create_all()

    return app