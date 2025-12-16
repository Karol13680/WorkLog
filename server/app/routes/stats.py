from flask import Blueprint, jsonify, request
from app import db
from app.database import crud
from app.core.security import decode_access_token
from app.models.logs import Log as LogModel

stats_bp = Blueprint("stats", __name__, url_prefix="/stats")

@stats_bp.route("/dashboard", methods=["GET"])
def get_dashboard_stats():
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

        active_projects_count = 0
        completed_projects_count = 0

        for job in user_jobs:
            status = crud.get_status_by_id(job.id_status)
            status_name = status.name.lower() if status and status.name else ""

            if status_name == "zakończony":
                completed_projects_count += 1
            else:
                active_projects_count += 1

        total_profit = 0
        total_duration_seconds = 0

        all_user_logs = LogModel.query.filter(
            LogModel.id_job.in_(job_ids),
            LogModel.stop.isnot(None)
        ).all()

        log_duration_map = {}
        for log in all_user_logs:
            duration_sec = (log.stop - log.start).total_seconds()
            log_duration_map[log.id_job] = log_duration_map.get(log.id_job, 0) + duration_sec
            total_duration_seconds += duration_sec

        for job in user_jobs:
            duration_sec = log_duration_map.get(job.id, 0)
            rate = job.value or 0
            duration_hours = duration_sec / 3600
            total_profit += (duration_hours * rate)

        profit_str = f"{total_profit:,.2f} zł".replace(",", " ")
        total_worked_hours = round(total_duration_seconds / 3600)

        stats_data = {
            "active_projects": {
                "title": "Aktywne projekty",
                "value": active_projects_count,
                "percentageChange": None
            },
            "time_worked": {
                "title": "Przepracowany czas",
                "value": total_worked_hours,
                "percentageChange": None
            },
            "completed_projects": {
                "title": "Ukończone projekty",
                "value": completed_projects_count,
                "percentageChange": None
            },
            "profit": {
                "title": "Zysk",
                "value": profit_str,
                "percentageChange": None
            }
        }

        return jsonify(stats_data), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Wystąpił wewnętrzny błąd serwera: {str(e)}"}), 500
