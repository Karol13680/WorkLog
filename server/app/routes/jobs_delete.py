from flask import Blueprint, jsonify
from app import db
from app.database import crud

jobs_delete_bp = Blueprint("jobs_delete", __name__, url_prefix="/jobs")


@jobs_delete_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_job(id):
    try:
        job = crud.get_job_by_id(id)
        if not job:
            return jsonify({"message": "Projekt o podanym ID nie istnieje."}), 404

        # Usuń wszystkie linki powiązane z projektem
        crud.delete_links_by_job(job.id)

        db.session.delete(job)
        db.session.commit()

        return jsonify({"message": "Projekt i wszystkie powiązane linki zostały usunięte."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd delete_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas usuwania projektu."}), 500
