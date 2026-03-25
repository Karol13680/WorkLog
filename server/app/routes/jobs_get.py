from flask import Blueprint, jsonify, request
from app.database import crud
from app.core.security import get_current_user_id

job_get_bp = Blueprint("job_get", __name__, url_prefix="/jobs")

@job_get_bp.route("/all-user", methods=["GET"])
def get_user_jobs():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

        jobs = crud.get_jobs_by_user_id(user_id)
        projects_list = []
        
        for job in jobs:
            client = crud.get_client_by_id(job.id_client)
            status = crud.get_status_by_id(job.id_status)
            contact = crud.get_contact_by_id(client.id_contact) if client else None

            projects_list.append({
                "id": job.id,
                "title": job.short_desc or "Brak tytułu",
                "status": status.name if status else "Brak statusu",
                "client": client.name if client else "Brak klienta",
                "description": job.long_desc or "Brak opisu",
                "email": contact.email if contact else "Brak e-mail",
                "phone": contact.phone if contact else "Brak telefonu",
                "rate": f"{job.value:.2f} zł/h" if job.value else "0.00 zł/h"
            })

        return jsonify(projects_list), 200

    except Exception as e:
        print(f"[Błąd get_user_jobs]: {e}")
        return jsonify({"message": "Błąd podczas pobierania projektów."}), 500

@job_get_bp.route("/<int:id>", methods=["GET"])
def get_job(id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

        job = crud.get_job_by_id(id)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Projekt nie istnieje lub brak dostępu."}), 404

        links = crud.get_links_by_job(job.id) or []
        return jsonify({
            "job": {
                "id": job.id,
                "value": job.value,
                "short_desc": job.short_desc,
                "long_desc": job.long_desc,
                "date_start": job.date_start.isoformat() if job.date_start else None,
                "date_stop": job.date_stop.isoformat() if job.date_stop else None,
                "proximity": job.proximity,
                "id_priority": job.id_priority,
                "id_status": job.id_status,
                "id_client": job.id_client
            },
            "links": [{"id": l.id, "url": l.url, "id_link_type": l.id_link_type} for l in links]
        }), 200
    except Exception as e:
        print(f"[Błąd get_job]: {e}")
        return jsonify({"message": "Błąd pobierania danych."}), 500