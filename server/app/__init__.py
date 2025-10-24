import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

load_dotenv()
db = SQLAlchemy() 

def create_app():
    app = Flask(__name__, instance_relative_config=False)
    
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY') or 'bardzo_tajny_klucz_deweloperski',
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if not app.config.get('SQLALCHEMY_DATABASE_URI'):
        raise EnvironmentError("BŁĄD: Zmienna środowiskowa DATABASE_URL nie została znaleziona. Sprawdź plik .env.")

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from app.models import users as _
        from app.models import jobs as _
        from app.models import priorities as _
        from app.models import status as _
        from app.models import job_titles as _
        from app.models import clients as _
        from app.models import contacts as _
        from app.models import links as _
        from app.models import links_type as _
        from app.models import logs as _
        
        db.create_all()

        from .routes import register_routes
        register_routes(app)

    return app
