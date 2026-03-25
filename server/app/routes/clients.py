from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.extensions import db
from app.database import crud
from app.core.security import get_current_user_id
import os

client_bp = Blueprint("clients", __name__, url_prefix="/clients")

@client_bp.route("/add", methods=["POST"])
def add_client():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        name = request.form.get("name")
        description = request.form.get("description")
        email = request.form.get("email")
        phone = request.form.get("phone")
        page = request.form.get("page")
        address = request.form.get("address")

        if not name:
            return jsonify({"message": "Pole 'name' jest wymagane."}), 400

        logo_file = request.files.get("logo")
        logo_path = None

        if logo_file:
            upload_folder = os.path.join(current_app.root_path, "static", "logo")
            os.makedirs(upload_folder, exist_ok=True)
            filename = secure_filename(logo_file.filename)
            logo_path = os.path.join("static", "logo", filename)
            logo_file.save(os.path.join(current_app.root_path, logo_path))

        contact = crud.create_contact(
            email=email,
            phone=phone,
            page=page,
            address=address
        )

        client = crud.create_client(
            name=name,
            description=description,
            logo=logo_path,
            id_contact=contact.id,
            id_user=user_id
        )

        return jsonify({
            "message": "Klient został dodany pomyślnie.",
            "client": {
                "id": client.id,
                "name": client.name
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd add_client]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas dodawania klienta."}), 500