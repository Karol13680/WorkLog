from flask import Blueprint, jsonify
from app import db
from app.database import crud
from app.core.security import get_current_user_id

jobs_delete_bp = Blueprint("jobs_delete", __name__, url_prefix="/jobs")

@jobs_delete_bp.route("/delete/<int:id>", methods=["DELETE"])
def delete_job(id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

        job = crud.get_job_by_id(id)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Brak dostępu lub obiekt nie istnieje."}), 403

        crud.delete_links_by_job(job.id)
        db.session.delete(job)
        db.session.commit()

        return jsonify({"message": "Projekt usunięty."}), 200
    except Exception as e:
        db.session.rollback()
        print(f"[Błąd delete_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas usuwania."}), 500