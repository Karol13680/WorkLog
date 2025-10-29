from flask import Blueprint, jsonify, request
from app.database import crud
from app.core.security import decode_access_token

client_get_bp = Blueprint("client_get", __name__, url_prefix="/clients")

@client_get_bp.route("/all-user", methods=["GET"])
def get_clients_for_user():
    """Zwraca wszystkich klientów przypisanych do zalogowanego użytkownika."""
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"message": "Brak autoryzacji"}), 401

    try:
        token_type, token = auth_header.split()
        if token_type.lower() != "bearer":
            return jsonify({"message": "Niepoprawny typ tokenu"}), 401

        # token JWT
        payload = decode_access_token(token)
        if not payload:
            return jsonify({"message": "Nieprawidłowy lub wygasły token"}), 401

        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"message": "Niepoprawny token"}), 401

        clients = crud.get_clients_by_user_id(user_id)

        return jsonify([
            {
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "logo": c.logo,
                "id_contact": c.id_contact
            } for c in clients
        ]), 200

    except Exception as e:
        print(f"[Błąd get_clients_for_user]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania klientów."}), 500
