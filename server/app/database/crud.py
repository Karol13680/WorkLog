from app import db
from app.models.users import User as UserModel
from app.models.clients import Client as ClientModel
from app.models.contacts import Contact as ContactModel
from app.models.jobs import Job as JobModel
from app.models.links import Link as LinkModel
from app.models.logs import Log as LogModel
from app.models.status import Status as StatusModel
from app.models.job_titles import JobTitle as JobTitleModel
from app.models.priorities import Priority as PriorityModel

from app.schemas.user import UserCreate
from app.core.security import hash_password
from datetime import datetime

# ----------------- Users -----------------
def get_user_by_email(email: str):
    return UserModel.query.filter_by(email=email).first()

def create_user(user_data: UserCreate):
    hashed_pass = hash_password(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        name=user_data.name,
        surname=user_data.surname,
        hashed_password=hashed_pass
    )
    db.session.add(db_user)
    db.session.commit()
    db.session.refresh(db_user)
    return db_user

# ----------------- Contacts -----------------
def create_contact(email=None, phone=None, page=None, address=None):
    db_contact = ContactModel(
        email=email,
        phone=phone,
        page=page,
        address=address
    )
    db.session.add(db_contact)
    db.session.commit()
    db.session.refresh(db_contact)
    return db_contact

def get_contact_by_id(contact_id):
    return ContactModel.query.filter_by(id=contact_id).first()

# ----------------- Clients -----------------
def create_client(name, description=None, logo=None, id_contact=None, user_id=None):
    client = ClientModel(
        name=name,
        description=description,
        logo=logo,
        id_contact=id_contact,
        user_id=user_id
    )
    db.session.add(client)
    db.session.commit()
    db.session.refresh(client)
    return client

def get_client_by_id(client_id):
    return ClientModel.query.filter_by(id=client_id).first()

def get_clients_by_user_id(user_id):
    return ClientModel.query.filter_by(user_id=user_id).all()

# ----------------- Jobs -----------------
def create_job(value=None, short_desc=None, long_desc=None, date_start=None, date_stop=None,
               proximity=None, id_priority=None, id_titles=None, id_status=None,
               id_user=None, id_client=None):
    job = JobModel(
        value=value,
        short_desc=short_desc,
        long_desc=long_desc,
        date_start=date_start,
        date_stop=date_stop,
        proximity=proximity,
        id_priority=id_priority,
        id_titles=id_titles,
        id_status=id_status,
        id_user=id_user,
        id_client=id_client
    )
    db.session.add(job)
    db.session.commit()
    db.session.refresh(job)
    return job

def get_job_by_id(job_id):
    return JobModel.query.filter_by(id=job_id).first()

def get_jobs_by_user_id(user_id):
    return JobModel.query.filter_by(id_user=user_id).all()

# ----------------- Links -----------------
def create_link(id_job, id_link_type=None, url=None):
    link = LinkModel(
        id_job=id_job,
        id_link_type=id_link_type,
        url=url
    )
    db.session.add(link)
    db.session.commit()
    db.session.refresh(link)
    return link

def delete_links_by_job(job_id):
    links = LinkModel.query.filter_by(id_job=job_id).all()
    for link in links:
        db.session.delete(link)
    db.session.commit()

# ----------------- Logs -----------------
def create_log(id_job, start=None, stop=None):
    if start is None:
        start = datetime.utcnow()
    log = LogModel(
        id_job=id_job,
        start=start,
        stop=stop
    )
    db.session.add(log)
    db.session.commit()
    db.session.refresh(log)
    return log

def get_log_by_id(log_id):
    return LogModel.query.filter_by(id=log_id).first()

def get_logs_by_job(id_job):
    return LogModel.query.filter_by(id_job=id_job).all()

def get_all_logs():
    return LogModel.query.all()

# ----------------- Status -----------------
def get_all_statuses():
    return StatusModel.query.all()

def get_status_by_id(status_id):
    """
    Pobiera pojedynczy status po ID.
    """
    return StatusModel.query.filter_by(id=status_id).first()

# ----------------- Job Titles -----------------
def get_all_job_titles():
    return JobTitleModel.query.all()

# ----------------- Priorities -----------------
def get_all_priorities():
    return PriorityModel.query.all()
