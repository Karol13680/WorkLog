import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

load_dotenv()
db = SQLAlchemy() 

def create_app():
    # Konfiguracja ścieżek dla Reacta
    static_dir = os.path.join(os.getcwd(), 'static')
    
    app = Flask(__name__, 
                instance_relative_config=False,
                static_folder=static_dir,
                static_url_path='')
    
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY') or 'bardzo_tajny_klucz_deweloperski',
        SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    if not app.config.get('SQLALCHEMY_DATABASE_URI'):
        raise EnvironmentError("BŁĄD: Zmienna środowiskowa DATABASE_URL nie została znaleziona. Sprawdź plik .env.")

    db.init_app(app)

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:5173", "http://localhost:5000"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    migrate = Migrate(app, db)

    # Rejestracja tras API
    from .routes import register_routes
    register_routes(app)

    # Serwowanie Frontendu (React)
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    # Obsługa pozostałych ścieżek (routing Reacta)
    @app.errorhandler(404)
    def not_found(e):
        # Najpierw sprawdź czy plik istnieje (np. assets/logo.png)
        # Jeśli nie, zwróć index.html dla React Routera
        return send_from_directory(app.static_folder, 'index.html')

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

    return app