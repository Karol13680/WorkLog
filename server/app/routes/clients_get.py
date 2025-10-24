from flask import Blueprint, jsonify
from app.database import crud

client_get_bp = Blueprint("client_get", __name__, url_prefix="/clients")

@client_get_bp.route("/<int:id>", methods=["GET"])
def get_client(id):
    try:
        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404

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
