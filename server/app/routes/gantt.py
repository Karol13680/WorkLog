from flask import Blueprint, jsonify, request, current_app, render_template
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
import os
from app.database.db import db
from app.database import crud
from app.core.security import get_current_user_id

from app.models.status import Status as StatusModel
from app.models.logs import Log as LogModel
from app.models.jobs import Job as JobModel 

statuses_bp = Blueprint("statuses_all", __name__, url_prefix="/status")

@statuses_bp.route("/all", methods=["GET"])
def get_all_statuses():
    try:
        statuses = crud.get_all_statuses()
        result = [{"id": s.id, "name": s.name} for s in statuses]
        return jsonify({"statuses": result}), 200
    except Exception as e:
        print(f"[Błąd get_all_statuses]: {e}")
        return jsonify({"message": "Błąd pobierania statusów."}), 500

gantt_bp = Blueprint("gantt", __name__, url_prefix="/stats")

@gantt_bp.route("/gantt", methods=["GET"])
def get_gantt_data():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

        user_jobs = JobModel.query.filter_by(id_user=user_id).all()
        
        if not user_jobs:
            return jsonify({"tasks": []}), 200

        job_ids = [job.id for job in user_jobs]

        all_user_logs = db.session.query(LogModel).filter(
            LogModel.id_job.in_(job_ids),
            LogModel.stop.isnot(None)
        ).all()

        tasks = []
        for log in all_user_logs:
            job = next((j for j in user_jobs if j.id == log.id_job), None)
            if not job:
                continue

            tasks.append({
                "name": getattr(job, "short_desc", "Bez nazwy"),
                "start": log.start.isoformat() if hasattr(log.start, 'isoformat') else str(log.start),
                "end": log.stop.isoformat() if hasattr(log.stop, 'isoformat') else str(log.stop)
            })

        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        print(f"[Błąd gantt]: {e}")
        return jsonify({"message": "Błąd serwera."}), 500

client_bp = Blueprint("clients", __name__, url_prefix="/clients")

@client_bp.route("/add", methods=["POST"])
def add_client():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji"}), 401

        name = request.form.get("name")
        description = request.form.get("description")
        email = request.form.get("email")
        phone = request.form.get("phone")
        page = request.form.get("page")
        address = request.form.get("address")

        if not name:
            return jsonify({"message": "Pole 'name' jest wymagane."}), 400

        logo_file = request.files.get("logo")
        logo_path = None

        if logo_file:
            upload_folder = os.path.join(current_app.root_path, "static", "logo")
            os.makedirs(upload_folder, exist_ok=True)
            filename = secure_filename(logo_file.filename)
            logo_path = os.path.join("static", "logo", filename)
            logo_file.save(os.path.join(current_app.root_path, logo_path))

        contact = crud.create_contact(
            email=email,
            phone=phone,
            page=page,
            address=address
        )

        client = crud.create_client(
            name=name,
            description=description,
            logo=logo_path,
            id_contact=contact.id,
            id_user=user_id
        )

        return jsonify({
            "message": "Klient został dodany pomyślnie.",
            "client": {
                "id": client.id,
                "name": client.name,
                "id_user": getattr(client, "id_user", user_id)
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"[Błąd add_client]: {e}")
        return jsonify({"message": "Błąd serwera podczas dodawania klienta."}), 500