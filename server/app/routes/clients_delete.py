from flask import Blueprint, jsonify, current_app
from app import db
from app.database import crud
import os

client_delete_bp = Blueprint("clients_delete", __name__, url_prefix="/clients")


@client_delete_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_client(id):
    try:
        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404

        contact = crud.get_contact_by_id(client.id_contact)

        # Usuwanie pliku logo z dysku (jeśli istnieje)
        if client.logo:
            logo_path = os.path.join(current_app.root_path, client.logo)
            if os.path.exists(logo_path):
                os.remove(logo_path)

        # Usuwanie klienta i kontaktu z bazy
        if contact:
            db.session.delete(contact)
        db.session.delete(client)
        db.session.commit()

        return jsonify({"message": "Klient i powiązany kontakt zostały usunięte pomyślnie."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd delete_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas usuwania klienta."}), 500
