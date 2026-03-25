from flask import Blueprint, jsonify, current_app
from app import db
from app.database import crud
from app.core.security import get_current_user_id
import os

client_delete_bp = Blueprint("clients_delete", __name__, url_prefix="/clients")

@client_delete_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_client(id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404
            
        # ZMIANA: client.id_user zamiast client.user_id
        if client.id_user != user_id:
            return jsonify({"message": "Brak dostępu do zasobu."}), 403

        contact = crud.get_contact_by_id(client.id_contact)

        if client.logo:
            full_path = os.path.join(current_app.root_path, client.logo)
            if os.path.exists(full_path):
                os.remove(full_path)

        if contact:
            db.session.delete(contact)
            
        db.session.delete(client)
        db.session.commit()

        return jsonify({"message": "Klient został usunięty."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd delete_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas usuwania."}), 500