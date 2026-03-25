from flask import Blueprint, request, jsonify
from app import db
from app.database import crud
from app.core.security import get_current_user_id
import json

jobs_update_bp = Blueprint("jobs_update", __name__, url_prefix="/jobs")

@jobs_update_bp.route("/update/<int:id>", methods=["PUT"])
def update_job(id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        job = crud.get_job_by_id(id)
        if not job:
            return jsonify({"message": "Projekt o podanym ID nie istnieje."}), 404

        if job.id_user != user_id:
            return jsonify({"message": "Brak dostępu do tego projektu."}), 403

        data = request.form

        float_fields = ["value"]
        int_fields = ["proximity", "id_priority", "id_titles", "id_status", "id_client"]
        string_fields = ["short_desc", "long_desc", "date_start", "date_stop"]

        for field in string_fields:
            if field in data:
                setattr(job, field, data.get(field) or None)

        for field in float_fields:
            if field in data:
                val = data.get(field)
                setattr(job, field, float(val) if val else 0.0)

        for field in int_fields:
            if field in data:
                val = data.get(field)
                setattr(job, field, int(val) if val else None)

        links_json = data.get("links")
        if links_json:
            links_list = json.loads(links_json)
            crud.delete_links_by_job(job.id)
            for link_data in links_list:
                crud.create_link(
                    id_job=job.id,
                    id_link_type=link_data.get("id_link_type"),
                    url=link_data.get("url")
                )

        db.session.commit()
        return jsonify({"message": "Projekt został zaktualizowany."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd update_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas aktualizacji projektu."}), 500