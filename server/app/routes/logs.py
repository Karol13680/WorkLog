from flask import Blueprint, request, jsonify
from app import db
from app.database import crud
from datetime import datetime
from app.core.security import get_current_user_id
from app.models.logs import Log
from app.models.jobs import Job

logs_bp = Blueprint("logs", __name__, url_prefix="/logs")

@logs_bp.route("/start", methods=["POST"])
def start_log():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        data = request.get_json(silent=True) or {}
        if "id_job" not in data:
            return jsonify({"message": "Pole 'id_job' jest wymagane."}), 400

        id_job = data["id_job"]
        job = crud.get_job_by_id(id_job)
        
        if not job:
            return jsonify({"message": "Projekt o podanym ID nie istnieje."}), 404
        
        if job.id_user != user_id:
            return jsonify({"message": "Brak dostępu do tego projektu."}), 403

        log = crud.create_log(id_job=id_job, start=datetime.utcnow())

        return jsonify({
            "message": "Log rozpoczęty.",
            "log": {
                "id": log.id,
                "id_job": log.id_job,
                "start": log.start.isoformat()
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Wystąpił błąd podczas rozpoczęcia logu: {str(e)}"}), 500

@logs_bp.route("/stop/<int:log_id>", methods=["PUT"])
def stop_log(log_id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        log = crud.get_log_by_id(log_id)
        if not log:
            return jsonify({"message": "Log o podanym ID nie istnieje."}), 404

        job = crud.get_job_by_id(log.id_job)
        if job.id_user != user_id:
            return jsonify({"message": "Brak dostępu."}), 403

        log.stop = datetime.utcnow()
        db.session.commit()

        return jsonify({
            "message": "Log zatrzymany.",
            "stop": log.stop.isoformat()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Błąd serwera: {str(e)}"}), 500

@logs_bp.route("/job/<int:id_job>", methods=["GET"])
def get_logs_for_job(id_job):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        job = crud.get_job_by_id(id_job)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Brak dostępu."}), 403

        logs = crud.get_logs_by_job(id_job)
        return jsonify({
            "logs": [{
                "id": l.id,
                "start": l.start.isoformat(),
                "stop": l.stop.isoformat() if l.stop else None
            } for l in logs]
        }), 200
    except Exception as e:
        return jsonify({"message": f"Błąd pobierania logów: {str(e)}"}), 500
    
@logs_bp.route("/manual", methods=["POST"])
def create_manual_log():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        data = request.get_json(silent=True) or {}
        id_job = data.get("id_job")
        start_str = data.get("start")
        stop_str = data.get("stop")

        if not all([id_job, start_str, stop_str]):
            return jsonify({"message": "Brakujące dane."}), 400

        job = crud.get_job_by_id(id_job)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Brak dostępu do projektu."}), 403

        start_dt = datetime.strptime(start_str[:19], "%Y-%m-%dT%H:%M:%S")
        stop_dt = datetime.strptime(stop_str[:19], "%Y-%m-%dT%H:%M:%S")

        log = crud.create_manual_log(
            id_job=id_job,
            start=start_dt,
            stop=stop_dt
        )

        return jsonify({"message": "Dodano wpis ręczny", "id": log.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Błąd serwera: {str(e)}"}), 500
    
@logs_bp.route("/all", methods=["GET"])
def get_all_user_logs():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401
        
        logs = db.session.query(Log).join(Job).filter(Job.id_user == user_id).all()

        return jsonify({
            "logs": [{
                "id": l.id,
                "id_job": l.id_job,
                "start": l.start.isoformat(),
                "stop": l.stop.isoformat() if l.stop else None
            } for l in logs]
        }), 200
    except Exception as e:
        return jsonify({"message": f"Błąd serwera: {str(e)}"}), 500

@logs_bp.route("/<int:log_id>", methods=["DELETE"])
def delete_log(log_id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        log = crud.get_log_by_id(log_id)
        if not log:
            return jsonify({"message": "Log o podanym ID nie istnieje."}), 404

        job = crud.get_job_by_id(log.id_job)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Brak dostępu."}), 403

        db.session.delete(log)
        db.session.commit()

        return jsonify({"message": "Log usunięty pomyślnie"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Błąd serwera: {str(e)}"}), 500

@logs_bp.route("/<int:log_id>", methods=["PUT"])
def update_log(log_id):
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        log = crud.get_log_by_id(log_id)
        if not log:
            return jsonify({"message": "Log o podanym ID nie istnieje."}), 404

        job = crud.get_job_by_id(log.id_job)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Brak dostępu."}), 403

        data = request.get_json(silent=True) or {}
        start_str = data.get("start")
        stop_str = data.get("stop")

        if start_str:
            log.start = datetime.strptime(start_str[:19], "%Y-%m-%dT%H:%M:%S")
        if stop_str:
            log.stop = datetime.strptime(stop_str[:19], "%Y-%m-%dT%H:%M:%S")

        db.session.commit()

        return jsonify({
            "message": "Log zaktualizowany pomyślnie",
            "log": {
                "id": log.id,
                "start": log.start.isoformat(),
                "stop": log.stop.isoformat() if log.stop else None
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Błąd serwera: {str(e)}"}), 500
