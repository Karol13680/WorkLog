from flask import Blueprint, jsonify, request
from app.database import crud
from app.core.security import decode_access_token

client_get_bp = Blueprint("client_get", __name__, url_prefix="/clients")

@client_get_bp.route("/<int:id>", methods=["GET"])
def get_client(id):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"message": "Brak autoryzacji"}), 401
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

        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404

        # sprawdzamy, czy klient należy do użytkownika
        # tutaj możesz dodać filtr, np. klient.id_user == user_id, jeśli masz takie pole

        contact = crud.get_contact_by_id(client.id_contact)
        return jsonify({
            "client": {
                "id": client.id,
                "name": client.name,
                "description": client.description,
                "logo": client.logo,
                "id_contact": client.id_contact
            },
            "contact": {
                "email": contact.email if contact else None,
                "phone": contact.phone if contact else None,
                "page": contact.page if contact else None,
                "address": contact.address if contact else None
            }
        }), 200

    except Exception as e:
        print(f"[Błąd get_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania klienta."}), 500
