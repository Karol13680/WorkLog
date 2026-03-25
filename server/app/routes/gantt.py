from flask import Blueprint, jsonify, request, current_app, render_template, send_from_directory
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
import os
import logging
from app import db
from app.database import crud
from app.core.security import get_current_user_id
from app.models.status import Status as StatusModel
from app.models.logs import Log as LogModel

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

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

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

hello_bp = Blueprint('hello', __name__, url_prefix='/api')

@hello_bp.route('/hello', methods=['GET'])
def hello_api():
    return jsonify({"message": "Witaj z API!"})

@hello_bp.route('/db_status', methods=['GET'])
def db_status_check():
    try:
        statuses = StatusModel.query.all()
        status_list = [{"id": s.id, "name": s.name} for s in statuses]
        return jsonify({
            "database_status": "Połączenie aktywne",
            "statuses": status_list
        }), 200
    except SQLAlchemyError as e:
        current_app.logger.error(f"Błąd bazy danych: {e}", exc_info=True)
        return jsonify({"database_status": "BŁĄD POŁĄCZENIA"}), 500
    except Exception as e:
        current_app.logger.error(f"Błąd aplikacji: {e}", exc_info=True)
        return jsonify({"database_status": "BŁĄD APLIKACJI"}), 500

gantt_bp = Blueprint("gantt", __name__, url_prefix="/stats")

@gantt_bp.route("/gantt", methods=["GET"])
def get_gantt_data():
    try:
        user_id = get_current_user_id()
        if not user_id:
            return jsonify({"message": "Brak autoryzacji."}), 401

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

            tasks.append({
                "name": getattr(job, "short_desc", "Bez nazwy"),
                "start": log.start.isoformat(),
                "end": log.stop.isoformat()
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
            user_id=user_id
        )

        return jsonify({
            "message": "Klient został dodany pomyślnie.",
            "client": {
                "id": client.id,
                "name": client.name,
                "user_id": client.user_id
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"[Błąd add_client]: {e}")
        return jsonify({"message": "Błąd serwera."}), 500