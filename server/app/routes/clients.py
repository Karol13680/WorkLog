from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app import db
from app.database import crud
import os

client_bp = Blueprint("clients", __name__, url_prefix="/clients")


@client_bp.route("/add", methods=["POST"])
def add_client():
    """Dodaje nowego klienta wraz z kontaktem i logiem."""

    try:
        # Pobieranie pól tekstowych z formularza
        name = request.form.get("name")
        description = request.form.get("description")
        email = request.form.get("email")
        phone = request.form.get("phone")
        page = request.form.get("page")
        address = request.form.get("address")

        # Walidacja wymaganych danych
        if not name:
            return jsonify({"message": "Pole 'name' jest wymagane."}), 400

        # Obsługa pliku logo
        logo_file = request.files.get("logo")
        logo_path = None

        if logo_file:
            # Upewniamy się, że katalog istnieje
            upload_folder = os.path.join(current_app.root_path, "static", "logo")
            os.makedirs(upload_folder, exist_ok=True)

            # Zabezpieczenie nazwy pliku
            filename = secure_filename(logo_file.filename)
            logo_path = os.path.join("static", "logo", filename)

            # Zapis pliku na dysku
            logo_file.save(os.path.join(current_app.root_path, logo_path))

        # Tworzenie kontaktu
        contact = crud.create_contact(
            email=email,
            phone=phone,
            page=page,
            address=address
        )

        # Tworzenie klienta
        client = crud.create_client(
            name=name,
            description=description,
            logo=logo_path,
            id_contact=contact.id
        )

        # Sukces
        return jsonify({
            "message": "Klient został dodany pomyślnie.",
            "client": {
                "id": client.id,
                "name": client.name,
                "description": client.description,
                "logo": client.logo,
                "id_contact": client.id_contact
            },
            "contact": {
                "email": contact.email,
                "phone": contact.phone,
                "page": contact.page,
                "address": contact.address
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd add_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas dodawania klienta."}), 500
