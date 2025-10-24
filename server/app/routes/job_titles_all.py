from flask import Blueprint, jsonify
from app.database import crud

job_titles_bp = Blueprint("job_titles_all", __name__, url_prefix="/job_titles")

@job_titles_bp.route("/all", methods=["GET"])
def get_all_job_titles():
    try:
        titles = crud.get_all_job_titles()
        result = [{"id": t.id, "name": t.name} for t in titles]
        return jsonify({"job_titles": result}), 200
    except Exception as e:
        print(f"[Błąd get_all_job_titles]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania tytułów projektów."}), 500
