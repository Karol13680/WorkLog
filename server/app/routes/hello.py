from flask import Blueprint, jsonify, current_app
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.models.status import Status as StatusModel

hello_bp = Blueprint('hello', __name__, url_prefix='/api')

@hello_bp.route('/hello', methods=['GET'])
def hello_api():
    return jsonify({"message": "Witaj z API!"})

@hello_bp.route('/db_status', methods=['GET'])
def db_status_check():
    from app import db 
    try:
        statuses = StatusModel.query.all()
        status_list = [{"id": s.id, "name": s.name} for s in statuses]

        return jsonify({
            "database_status": "Połączenie aktywne",
            "statuses": status_list
        }), 200

    except SQLAlchemyError as e:
        current_app.logger.error(f"Błąd bazy danych (SQLAlchemyError): {e}", exc_info=True)
        return jsonify({
            "database_status": "BŁĄD POŁĄCZENIA",
            "error_details": "Błąd SQL/Baza danych. Szczegóły błędu zostały zarejestrowane w logach serwera."
        }), 500
    except Exception as e:
        current_app.logger.error(f"Nieoczekiwany błąd aplikacji: {e}", exc_info=True)
        return jsonify({
            "database_status": "BŁĄD APLIKACJI",
            "error_details": "Wystąpił nieoczekiwany błąd serwera."
        }), 500