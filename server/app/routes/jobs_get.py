from flask import Blueprint, jsonify, request
from app.database import crud
from app.core.security import decode_access_token

job_get_bp = Blueprint("job_get", __name__, url_prefix="/jobs")

@job_get_bp.route("/<int:id>", methods=["GET"])
def get_job(id):
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

        job = crud.get_job_by_id(id)
        if not job:
            return jsonify({"message": "Projekt o podanym ID nie istnieje."}), 404

        if job.id_user != user_id:
            return jsonify({"message": "Brak dostępu do tego projektu."}), 403

        try:
            links = crud.get_links_by_job(job.id) or []
            links_list = [{"id": l.id, "url": l.url, "id_link_type": l.id_link_type} for l in links]
        except Exception as e_links:
            print(f"[Błąd pobierania linków]: {e_links}")
            links_list = []

        return jsonify({
            "job": {
                "id": job.id,
                "value": job.value,
                "short_desc": job.short_desc,
                "long_desc": job.long_desc,
                "date_start": job.date_start,
                "date_stop": job.date_stop,
                "proximity": job.proximity,
                "id_priority": job.id_priority,
                "id_titles": job.id_titles,
                "id_status": job.id_status,
                "id_user": job.id_user,
                "id_client": job.id_client
            },
            "links": links_list
        }), 200

    except Exception as e:
        import traceback
        print("[Błąd get_job]:", e)
        traceback.print_exc()
        return jsonify({"message": f"Wystąpił błąd podczas pobierania projektu: {str(e)}"}), 500
