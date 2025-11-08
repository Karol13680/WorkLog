from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app import db
from app.database import crud
import os

client_update_bp = Blueprint("clients_update", __name__, url_prefix="/clients")


@client_update_bp.route("/update/<int:id>", methods=["PUT"])
def update_client(id):
    try:
        client = crud.get_client_by_id(id)
        if not client:
            return jsonify({"message": "Klient o podanym ID nie istnieje."}), 404

        contact = crud.get_contact_by_id(client.id_contact)

        name = request.form.get("name")
        description = request.form.get("description")
        email = request.form.get("email")
        phone = request.form.get("phone")
        page = request.form.get("page")
        address = request.form.get("address")
        logo_file = request.files.get("logo")

        if name:
            client.name = name
        if description:
            client.description = description

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

        return jsonify({
            "message": "Klient i kontakt zaktualizowani pomyślnie.",
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
        db.session.rollback()
        print(f"[Błąd update_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas aktualizacji klienta."}), 500

