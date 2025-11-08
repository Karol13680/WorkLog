from flask import Blueprint, request, jsonify
from app import db
from app.database import crud
from app.core.security import decode_access_token

jobs_bp = Blueprint("jobs", __name__, url_prefix="/jobs")

def safe_int(val):
    try:
        return int(val)
    except (TypeError, ValueError):
        return None

def safe_float(val):
    try:
        return float(val)
    except (TypeError, ValueError):
        return None

@jobs_bp.route("/add", methods=["POST"])
def add_job():
    try:
        data = request.form

        # short_desc = nazwa projektu, value = opis
        # Zastosowano safe_float do pola 'value'
        short_desc = data.get("short_desc")
        value = safe_float(data.get("value")) 
        long_desc = data.get("long_desc")
        date_start = data.get("date_start")
        date_stop = data.get("date_stop")
        proximity = safe_float(data.get("proximity"))

        # konwersja ID
        id_priority = safe_int(data.get("id_priority"))
        id_titles = safe_int(data.get("id_titles"))
        id_status = safe_int(data.get("id_status"))
        id_client = safe_int(data.get("id_client"))

        # odczyt user_id z tokena
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"message": "Brak autoryzacji"}), 401
        
        try:
            token_type, token = auth_header.split()
            if token_type.lower() != "bearer":
                return jsonify({"message": "Niepoprawny typ tokenu"}), 401
        except ValueError:
             return jsonify({"message": "Niepoprawny format nagłówka Authorization"}), 401

        payload = decode_access_token(token)
        if not payload:
             return jsonify({"message": "Nieprawidłowy token lub token wygasł"}), 401

        id_user = payload.get("user_id")
        if not id_user:
            return jsonify({"message": "Nieprawidłowy token (brak user_id)"}), 401

        job = crud.create_job(
            value=value,
            short_desc=short_desc,
            long_desc=long_desc,
            date_start=date_start,
            date_stop=date_stop,
            proximity=proximity,
            id_priority=id_priority,
            id_titles=id_titles,
            id_status=id_status,
            id_user=id_user,
            id_client=id_client
        )

        return jsonify({
            "message": "Projekt został dodany.",
            "job": {
                "id": job.id,
                "value": job.value,
                "short_desc": job.short_desc,
                "long_desc": job.long_desc,
                "date_start": job.date_start,
                "date_stop": job.date_stop,
                "proximity": job.proximity,
                "id_priority": job.id_priority,
                "id_titles": job.id_titles,
                "id_status": job.id_status,
                "id_user": job.id_user,
                "id_client": job.id_client
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd add_job]: {e}", flush=True)
        return jsonify({"message": f"Wystąpił błąd podczas dodawania projektu: {e}"}), 500
