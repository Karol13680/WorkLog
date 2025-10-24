from flask import Blueprint, request, jsonify
from app import db
from app.database import crud

jobs_bp = Blueprint("jobs", __name__, url_prefix="/jobs")


@jobs_bp.route("/add", methods=["POST"])
def add_job():
    try:
        data = request.form

        value = data.get("value")
        short_desc = data.get("short_desc")
        long_desc = data.get("long_desc")
        date_start = data.get("date_start")
        date_stop = data.get("date_stop")
        proximity = data.get("proximity")
        id_priority = data.get("id_priority")
        id_titles = data.get("id_titles")
        id_status = data.get("id_status")
        id_user = data.get("id_user")
        id_client = data.get("id_client")

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
        print(f"[Błąd add_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas dodawania projektu."}), 500
