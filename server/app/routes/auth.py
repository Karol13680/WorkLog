from flask import Blueprint, request, jsonify
from ..database import crud
from app.schemas.user import UserCreate
from app.core.security import verify_password, create_access_token, decode_access_token
from app import db
from sqlalchemy.exc import IntegrityError
from datetime import timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['email', 'password', 'name', 'surname']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Brak wszystkich wymaganych pól (email, password, name, surname)."}), 400

    user_data = UserCreate(
        email=data['email'],
        password=data['password'],
        name=data['name'],
        surname=data['surname']
    )

    if crud.get_user_by_email(email=user_data.email):
        return jsonify({"message": "Email jest już zarejestrowany."}), 400

    try:
        new_user = crud.create_user(user_data=user_data)
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

@auth_bp.route('/login', methods=['POST'])
def login():
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

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"message": "Brak nagłówka Authorization"}), 401
    try:
        token_type, token = auth_header.split()
        if token_type.lower() != "bearer":
            return jsonify({"message": "Niepoprawny typ tokenu"}), 401

        payload = decode_access_token(token)
        if not payload:
            return jsonify({"message": "Nieprawidłowy lub wygasły token"}), 401

        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"message": "Niepoprawny token"}), 401

        user = crud.get_user_by_id(user_id)
        if not user:
            return jsonify({"message": "Użytkownik nie istnieje"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "email": user.email
        }), 200

    except Exception as e:
        print(f"[Błąd get_current_user]: {e}")
        return jsonify({"message": "Nie udało się pobrać danych użytkownika"}), 500
