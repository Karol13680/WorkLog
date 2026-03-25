from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app import db
from app.database import crud
from app.core.security import get_current_user_id
import os

client_update_bp = Blueprint("clients_update", __name__, url_prefix="/clients")

@client_update_bp.route("/update/<int:id>", methods=["PUT"])
def update_client(id):
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

        # Pobieranie danych (obsługa zarówno JSON jak i FormData)
        data = request.form if request.form else request.get_json()
        
        name = data.get("name")
        description = data.get("description")
        email = data.get("email")
        phone = data.get("phone")
        page = data.get("page")
        address = data.get("address")
        logo_file = request.files.get("logo")

        if name: client.name = name
        if description: client.description = description

        if contact:
            if email: contact.email = email
            if phone: contact.phone = phone
            if page: contact.page = page
            if address: contact.address = address

        if logo_file:
            upload_folder = os.path.join(current_app.root_path, "static", "logo")
            os.makedirs(upload_folder, exist_ok=True)
            filename = secure_filename(logo_file.filename)
            logo_path = os.path.join("static", "logo", filename)
            logo_file.save(os.path.join(current_app.root_path, logo_path))
            client.logo = logo_path

        db.session.commit()

        return jsonify({"message": "Klient zaktualizowany pomyślnie."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd update_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas aktualizacji."}), 500