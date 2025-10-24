from flask import Blueprint, jsonify
from app.database import crud
from app.core.security import get_current_user_id

client_get_bp = Blueprint("client_get", __name__, url_prefix="/clients")

@client_get_bp.route("/<int:id>", methods=["GET"])
def get_client(id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404

        # Jeśli klient należy do innego użytkownika, blokujemy dostęp
        if hasattr(client, "id_user") and client.id_user != user_id:
            return jsonify({"message": "Brak dostępu do tego klienta."}), 403

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
        import traceback
        print(f"[Błąd get_client]: {e}")
        traceback.print_exc()
        return jsonify({"message": "Wystąpił błąd podczas pobierania klienta."}), 500
