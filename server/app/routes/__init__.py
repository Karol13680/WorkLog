from .hello import hello_bp
from .main import main_bp
from .auth import auth_bp
from .clients import client_bp
from .clients_update import client_update_bp
from .clients_delete import client_delete_bp
from .clients_get import client_get_bp
from .jobs import jobs_bp
from .jobs_update import jobs_update_bp
from .jobs_delete import jobs_delete_bp
from .jobs_get import job_get_bp
from .logs import logs_bp
from .statuses_all import statuses_bp
from .job_titles_all import job_titles_bp
from .priorities_all import priorities_bp


def register_routes(app):
    app.register_blueprint(main_bp)
    app.register_blueprint(hello_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(client_update_bp)
    app.register_blueprint(client_delete_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(jobs_update_bp)
    app.register_blueprint(jobs_delete_bp)
    app.register_blueprint(logs_bp)
    app.register_blueprint(client_get_bp)
    app.register_blueprint(job_get_bp)
    app.register_blueprint(statuses_bp)
    app.register_blueprint(job_titles_bp)
    app.register_blueprint(priorities_bp)
