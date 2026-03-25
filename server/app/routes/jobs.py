from flask import Blueprint, request, jsonify
from app.database import crud
from app.core.security import get_current_user_id

jobs_bp = Blueprint("jobs", __name__, url_prefix="/jobs")

@jobs_bp.route("/add", methods=["POST"])
def add_job():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        value = request.form.get("value")
        proximity = request.form.get("proximity")
        id_priority = request.form.get("id_priority")
        id_status = request.form.get("id_status")
        id_client = request.form.get("id_client")

        job = crud.create_job(
            value=float(value) if value else 0.0,
            short_desc=request.form.get("short_desc"),
            long_desc=request.form.get("long_desc"),
            date_start=request.form.get("date_start") or None,
            date_stop=request.form.get("date_stop") or None,
            proximity=int(proximity) if proximity else 0,
            id_priority=int(id_priority) if id_priority else None,
            id_status=int(id_status) if id_status else None,
            id_user=user_id,
            id_client=int(id_client) if id_client else None
        )

        return jsonify({"message": "Zadanie dodane", "id": job.id}), 201

    except Exception as e:
        print(f"[Błąd add_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas dodawania zadania."}), 500