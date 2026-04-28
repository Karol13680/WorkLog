import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from app.database.db import db

# Ładujemy zmienne z .env (jeśli istnieje lokalnie)
load_dotenv()

def create_app():
    # Ścieżka do plików statycznych (zbudowany React)
    static_dir = os.path.join(os.getcwd(), 'static')
    
    app = Flask(__name__, 
                instance_relative_config=False,
                static_folder=static_dir,
                static_url_path='')
    
    # --- POBIERANIE URL BAZY DANYCH ---
    uri = os.getenv('DATABASE_URL')
    
    # Logowanie dla Ciebie (zobaczysz to w zakładce Logs na Renderze)
    if uri:
        print(f"DEBUG: Pomyślnie pobrano DATABASE_URL (zaczyna się od: {uri[:10]}...)")
    else:
        print("DEBUG: BŁĄD! DATABASE_URL jest puste (None). Sprawdź zmienne w Renderze.")

    # Fix dla SQLAlchemy (zamiana postgres:// na postgresql://)
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY') or 'dev_key_123',
        SQLALCHEMY_DATABASE_URI=uri,
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    # Inicjalizacja bazy danych i migracji
    db.init_app(app)
    Migrate(app, db)

    # --- KONFIGURACJA CORS ---
    # Musimy pozwolić Twojemu frontendowi na Renderze gadać z backendem
    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://localhost:5173", 
            "http://localhost:5000",
            "https://worklog-y86k.onrender.com" # Twoja domena produkcyjna
        ],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"]
    )

    # Rejestracja blueprintów/tras
    from .routes import register_routes
    register_routes(app)

    # Obsługa plików statycznych (React)
    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

    # Automatyczne tworzenie tabel (tylko jeśli baza jest podpięta)
    with app.app_context():
        if uri:
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
            
            try:
                db.create_all()
                print("DEBUG: Tabele bazy danych zostały sprawdzone/utworzone.")
            except Exception as e:
                print(f"DEBUG: Błąd podczas db.create_all(): {e}")
        else:
            print("DEBUG: Pominiecie db.create_all() - brak URL bazy.")

    return app