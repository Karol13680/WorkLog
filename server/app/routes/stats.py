from flask import Blueprint, jsonify
from app.database import crud
from app.core.security import get_current_user_id
from app.extensions import db
from app.models.logs import Log as LogModel
from app.models.jobs import Job as JobModel
from datetime import datetime


stats_bp = Blueprint("stats", __name__, url_prefix="/stats")

@stats_bp.route("/dashboard", methods=["GET"])
def get_dashboard_stats():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

        user_jobs = crud.get_jobs_by_user_id(user_id)
        if not user_jobs:
            return jsonify({
                "active_projects": {"title": "Aktywne projekty", "value": 0},
                "time_worked": {"title": "Przepracowany czas", "value": 0},
                "completed_projects": {"title": "Ukończone projekty", "value": 0},
                "profit": {"title": "Zysk", "value": "0.00 zł"}
            }), 200

        job_ids = [job.id for job in user_jobs]
        active_projects_count = 0
        completed_projects_count = 0

        for job in user_jobs:
            status = crud.get_status_by_id(job.id_status)
            status_name = status.name.lower() if status and status.name else ""
            if "zakończ" in status_name:
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
            rate = float(job.value) if job.value else 0.0
            total_profit += ((duration_sec / 3600) * rate)

        return jsonify({
            "active_projects": {"title": "Aktywne projekty", "value": active_projects_count},
            "time_worked": {"title": "Przepracowany czas (h)", "value": round(total_duration_seconds / 3600)},
            "completed_projects": {"title": "Ukończone projekty", "value": completed_projects_count},
            "profit": {"title": "Zysk", "value": f"{total_profit:,.2f} zł".replace(",", " ")}
        }), 200
    except Exception as e:
        print(f"[Błąd dashboard]: {e}")
        return jsonify({"message": "Błąd serwera."}), 500

@stats_bp.route("/gantt", methods=["GET"])
def get_gantt_stats():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        # ZAMIENIONO crud.Job NA JobModel
        logs = db.session.query(LogModel).join(JobModel).filter(
            JobModel.id_user == user_id,
            LogModel.stop.isnot(None)
        ).all()

        tasks_list = []
        for l in logs:
            job = crud.get_job_by_id(l.id_job)
            tasks_list.append({
                "name": job.short_desc if job else "Zadanie",
                "start": l.start.isoformat(),
                "end": l.stop.isoformat()
            })

        return jsonify({"tasks": tasks_list}), 200
    except Exception as e:
        print(f"[Błąd gantt]: {e}")
        return jsonify({"message": "Błąd serwera"}), 500

@stats_bp.route("/detailed-report", methods=["GET"])
def get_detailed_report():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        user_jobs = crud.get_jobs_by_user_id(user_id)
        report_data = []
        grand_total_profit = 0
        grand_total_seconds = 0

        for job in user_jobs:
            logs = crud.get_completed_logs_by_job(job.id)
            if not logs:
                continue

            project_seconds = sum((l.stop - l.start).total_seconds() for l in logs if l.stop and l.start)
            project_hours = project_seconds / 3600
            rate_val = float(job.value) if job.value is not None else 0.0
            project_profit = project_hours * rate_val
            
            client = crud.get_client_by_id(job.id_client)

            report_data.append({
                "project_name": job.short_desc or "Bez nazwy",
                "client_name": client.name if client else "Brak klienta",
                "formatted_time": f"{int(project_hours)}h {int((project_seconds % 3600) // 60)}m",
                "rate": f"{rate_val:.2f} zł/h",
                "profit_str": f"{project_profit:.2f} zł"
            })

            grand_total_profit += project_profit
            grand_total_seconds += project_seconds

        return jsonify({
            "projects": report_data,
            "summary": {
                "total_profit": f"{grand_total_profit:.2f} zł",
                "total_time": f"{int(grand_total_seconds // 3600)}h {int((grand_total_seconds % 3600) // 60)}m"
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"[Błąd detailed-report]: {e}")
        return jsonify({"message": "Błąd serwera"}), 500