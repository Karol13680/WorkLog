from flask import Blueprint, request, jsonify
from app import db
from app.database import crud
import json

jobs_update_bp = Blueprint("jobs_update", __name__, url_prefix="/jobs")


@jobs_update_bp.route("/update/<int:id>", methods=["PUT"])
def update_job(id):
    try:
        job = crud.get_job_by_id(id)
        if not job:
            return jsonify({"message": "Projekt o podanym ID nie istnieje."}), 404

        data = request.form

        # Aktualizacja pól projektu
        for field in ["value", "short_desc", "long_desc", "date_start", "date_stop",
                      "proximity", "id_priority", "id_titles", "id_status", "id_user", "id_client"]:
            if data.get(field) is not None:
                setattr(job, field, data.get(field))

        # Obsługa linków
        links_json = data.get("links")
        if links_json:
            links_list = json.loads(links_json)  # lista obiektów { "url": "...", "id_link_type": ... }

            # Usuń stare linki
            crud.delete_links_by_job(job.id)

            # Dodaj nowe linki
            for link_data in links_list:
                crud.create_link(
                    id_job=job.id,
                    id_link_type=link_data.get("id_link_type"),
                    url=link_data.get("url")
                )

        db.session.commit()

        return jsonify({
            "message": "Projekt został zaktualizowany.",
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
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd update_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas aktualizacji projektu."}), 500
