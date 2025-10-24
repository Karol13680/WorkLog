from flask import Blueprint, request, jsonify
from ..database import crud
from app.schemas.user import UserCreate
from app.core.security import verify_password, create_access_token
from app import db
from sqlalchemy.exc import IntegrityError
from datetime import timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

#  REJESTRACJA
@auth_bp.route('/register', methods=['POST'])
def register():
    """Obsługuje rejestrację nowego użytkownika."""
    data = request.get_json()
    
    # Walidacja
    required_fields = ['email', 'password', 'name', 'surname']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Brak wszystkich wymaganych pól (email, password, name, surname)."}), 400

    #  CRUD
    user_data = UserCreate(
        email=data['email'],
        password=data['password'],
        name=data['name'],
        surname=data['surname']
    )

    if crud.get_user_by_email(email=user_data.email):
        return jsonify({"message": "Email jest już zarejestrowany."}), 400

    try:
        #  Tworzenie użytkownika i zapis do bazy
        new_user = crud.create_user(user_data=user_data)
        
        # Sukces
        return jsonify({
            "id": new_user.id,
            "email": new_user.email,
            "message": "Użytkownik zarejestrowany pomyślnie."
        }), 201
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Błąd integralności danych (np. email już zajęty)."}), 500
    
    except Exception as e:
        print(f"Błąd rejestracji: {e}")
        db.session.rollback()
        return jsonify({"message": "Wystąpił nieoczekiwany błąd serwera."}), 500

# LOGOWANIE z JWT
@auth_bp.route('/login', methods=['POST'])
def login():
    """Obsługuje logowanie użytkownika i zwraca token JWT."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Brak danych logowania."}), 400

    user = crud.get_user_by_email(email=email)

    if not user or not verify_password(password, user.hashed_password):
        return jsonify({"message": "Nieprawidłowy email lub hasło."}), 401

    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email},
        expires_delta=timedelta(hours=1)
    )

    return jsonify({
        "message": "Zalogowano pomyślnie.",
        "user_id": user.id,
        "email": user.email,
        "access_token": access_token
    }), 200
