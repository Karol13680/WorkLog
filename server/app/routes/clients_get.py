from flask import Blueprint, jsonify, request
from app.database import crud
from app.core.security import get_current_user_id

client_get_bp = Blueprint("client_get", __name__, url_prefix="/clients")

@client_get_bp.route("/all-user", methods=["GET"])
def get_clients_for_user():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        clients = crud.get_clients_by_user_id(user_id)
        
        result = []
        for c in clients:
            # Pobieramy kontakt dla każdego klienta
            contact = crud.get_contact_by_id(c.id_contact)
            result.append({
                "id": c.id,
                "name": c.name,
                "description": c.description,
                "logo": c.logo,
                "contact": {
                    "email": contact.email if contact else None,
                    "phone": contact.phone if contact else None
                }
            })

        return jsonify(result), 200
    except Exception as e:
        print(f"[Błąd get_clients_for_user]: {e}")
        return jsonify({"message": "Wystąpił błąd."}), 500

@client_get_bp.route("/<int:id>", methods=["GET"])
def get_client_by_id(id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404
            
        # TUTAJ BYŁ BŁĄD: Zmień client.user_id na client.id_user
        if client.id_user != user_id:
            return jsonify({"message": "Brak dostępu do zasobu."}), 403

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
        print(f"[Błąd get_client_by_id]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania klienta."}), 500