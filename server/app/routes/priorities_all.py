from flask import Blueprint, jsonify
from app.database import crud

priorities_bp = Blueprint("priorities_all", __name__, url_prefix="/priorities")

@priorities_bp.route("/all", methods=["GET"])
def get_all_priorities():
    try:
        priorities = crud.get_all_priorities()
        result = [{"id": p.id, "name": p.name} for p in priorities]
        return jsonify({"priorities": result}), 200
    except Exception as e:
        print(f"[Błąd get_all_priorities]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania priorytetów."}), 500