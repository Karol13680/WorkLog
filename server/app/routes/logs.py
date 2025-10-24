from flask import Blueprint, request, jsonify
from app import db
from app.database import crud
from datetime import datetime

logs_bp = Blueprint("logs", __name__, url_prefix="/logs")

# START logu
@logs_bp.route("/start", methods=["POST"])
def start_log():
    try:
        data = request.get_json()
        if not data or "id_job" not in data:
            return jsonify({"message": "Pole 'id_job' jest wymagane."}), 400

        id_job = data["id_job"]

        from app.database.crud import get_job_by_id
        if not get_job_by_id(id_job):
            return jsonify({"message": "Projekt o podanym ID nie istnieje."}), 404

        log = crud.create_log(id_job=id_job, start=datetime.utcnow())

        return jsonify({
            "message": "Log rozpoczęty.",
            "log": {
                "id": log.id,
                "id_job": log.id_job,
                "start": log.start,
                "stop": log.stop
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd start_log]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas rozpoczęcia logu."}), 500

# STOP logu
@logs_bp.route("/stop/<int:log_id>", methods=["PUT"])
def stop_log(log_id):
    try:
        log = crud.get_log_by_id(log_id)
        if not log:
            return jsonify({"message": "Log o podanym ID nie istnieje."}), 404

        log.stop = datetime.utcnow()
        db.session.commit()

        return jsonify({
            "message": "Log zatrzymany.",
            "log": {
                "id": log.id,
                "id_job": log.id_job,
                "start": log.start,
                "stop": log.stop
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"[Błąd stop_log]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas zatrzymania logu."}), 500

# Pobranie logów dla projektu
@logs_bp.route("/job/<int:id_job>", methods=["GET"])
def get_logs_for_job(id_job):
    try:
        logs = crud.get_logs_by_job(id_job)
        logs_list = [{
            "id": log.id,
            "id_job": log.id_job,
            "start": log.start,
            "stop": log.stop
        } for log in logs]

        return jsonify({"logs": logs_list}), 200

    except Exception as e:
        print(f"[Błąd get_logs_for_job]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania logów."}), 500

# POBRANIE WSZYSTKICH LOGÓW
@logs_bp.route("/all", methods=["GET"])
def get_all_logs():
    try:
        logs = crud.get_all_logs()
        logs_list = [{
            "id": log.id,
            "id_job": log.id_job,
            "start": log.start,
            "stop": log.stop
        } for log in logs]

        return jsonify({"logs": logs_list}), 200

    except Exception as e:
        print(f"[Błąd get_all_logs]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas pobierania wszystkich logów."}), 500
