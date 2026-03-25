from flask import Blueprint, request, jsonify
from app import db
from app.database import crud
from datetime import datetime
from app.core.security import get_current_user_id

logs_bp = Blueprint("logs", __name__, url_prefix="/logs")

@logs_bp.route("/start", methods=["POST"])
def start_log():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        data = request.get_json()
        if not data or "id_job" not in data:
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
        print(f"[Błąd start_log]: {e}")
        return jsonify({"message": "Wystąpił błąd podczas rozpoczęcia logu."}), 500

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
        print(f"[Błąd stop_log]: {e}")
        return jsonify({"message": "Błąd serwera."}), 500

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
        print(f"[Błąd get_logs]: {e}")
        return jsonify({"message": "Błąd pobierania logów."}), 500
    
@logs_bp.route("/manual", methods=["POST"])
def create_manual_log():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        data = request.get_json()
        id_job = data.get("id_job")
        start_str = data.get("start")
        stop_str = data.get("stop")

        if not all([id_job, start_str, stop_str]):
            return jsonify({"message": "Brakujące dane."}), 400

        job = crud.get_job_by_id(id_job)
        if not job or job.id_user != user_id:
            return jsonify({"message": "Brak dostępu do projektu."}), 403

        from datetime import datetime
        start_dt = datetime.fromisoformat(start_str.replace("Z", ""))
        stop_dt = datetime.fromisoformat(stop_str.replace("Z", ""))

        log = crud.create_manual_log(
            id_job=id_job,
            start=start_dt,
            stop=stop_dt
        )

        return jsonify({"message": "Dodano wpis ręczny", "id": log.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"[Błąd manual_log]: {e}")
        return jsonify({"message": "Błąd serwera."}), 500
    
@logs_bp.route("/all", methods=["GET"])
def get_all_user_logs():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        # Pobieramy wszystkie logi powiązane z zadaniami użytkownika
        from app.models.logs import Log
        from app.models.jobs import Job
        
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
        print(f"[Błąd get_all_user_logs]: {e}")
        return jsonify({"message": "Błąd serwera."}), 500
    
@logs_bp.route("/all", methods=["GET"])
def get_all_logs():
    try:
        user_id = get_current_user_id()
        if not user_id: return jsonify({"message": "Brak autoryzacji"}), 401

        logs = crud.get_logs_by_user(user_id)
        
        return jsonify({
            "logs": [{
                "id": l.id,
                "id_job": l.id_job,
                "start": l.start.isoformat(),
                "stop": l.stop.isoformat() if l.stop else None
            } for l in logs]
        }), 200
    except Exception as e:
        print(f"[Błąd logs/all]: {e}")
        return jsonify({"message": "Błąd serwera"}), 500