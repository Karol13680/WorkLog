from flask import Blueprint, jsonify
from app.database import crud

statuses_bp = Blueprint("statuses_all", __name__, url_prefix="/status")

@statuses_bp.route("/all", methods=["GET"])
def get_all_statuses():
    try:
        statuses = crud.get_all_statuses()
        result = [{"id": s.id, "name": s.name} for s in statuses]
        return jsonify({"statuses": result}), 200
    except Exception as e:
        print(f"[Błąd get_all_statuses]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania statusów."}), 500