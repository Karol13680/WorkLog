from flask import Blueprint, jsonify, request
from app import db
from app.database import crud
from app.core.security import decode_access_token
from app.models.logs import Log as LogModel

gantt_bp = Blueprint("gantt", __name__, url_prefix="/stats")

@gantt_bp.route("/gantt", methods=["GET"])
def get_gantt_data():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"message": "Brak autoryzacji."}), 401

    try:
        token_type, token = auth_header.split()
        if token_type.lower() != "bearer":
            return jsonify({"message": "Niepoprawny typ tokenu"}), 401

        payload = decode_access_token(token)
        if not payload:
            return jsonify({"message": "Nieprawidłowy lub wygasły token"}), 401

        user_id = payload.get("user_id")
        if not user_id:
            return jsonify({"message": "Niepoprawny token"}), 401

    except Exception as e:
        return jsonify({"message": f"Błąd autoryzacji: {str(e)}"}), 401

    try:
        user_jobs = crud.get_jobs_by_user_id(user_id)
        job_ids = [job.id for job in user_jobs]

        all_user_logs = LogModel.query.filter(
            LogModel.id_job.in_(job_ids),
            LogModel.stop.isnot(None)
        ).all()

        tasks = []
        for log in all_user_logs:
            job = crud.get_job_by_id(log.id_job)
            if not job:
                continue

            job_name = getattr(job, "short_desc", "Bez nazwy")

            tasks.append({
                "name": job_name,
                "start": log.start.isoformat(),
                "end": log.stop.isoformat()
            })

        return jsonify({"tasks": tasks}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Wystąpił wewnętrzny błąd serwera: {str(e)}"}), 500
