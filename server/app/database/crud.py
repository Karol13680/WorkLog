from app.database.db import db
from datetime import datetime

# Importujemy modele na górze, aby były atrybutami modułu crud
from app.models.users import User
from app.models.contacts import Contact
from app.models.clients import Client
from app.models.jobs import Job
from app.models.status import Status
from app.models.priorities import Priority
from app.models.job_titles import JobTitle
from app.models.links import Link
from app.models.logs import Log

# --- USER ---
def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()

def get_user_by_clerk_id(clerk_id: str):
    return User.query.filter_by(id=clerk_id).first()

def create_user(id: str, email: str, name: str, surname: str):
    db_user = User(id=id, email=email, name=name, surname=surname)
    db.session.add(db_user)
    db.session.commit()
    db.session.refresh(db_user)
    return db_user

# --- CONTACT ---
def create_contact(email=None, phone=None, page=None, address=None):
    db_contact = Contact(
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
    return Contact.query.get(contact_id)

# --- CLIENT ---
def create_client(name, description=None, logo=None, id_contact=None, id_user=None):
    client = Client(
        name=name,
        description=description,
        logo=logo,
        id_contact=id_contact,
        id_user=id_user # Upewnij się, że w modelu to id_user
    )
    db.session.add(client)
    db.session.commit()
    db.session.refresh(client)
    return client

def get_client_by_id(client_id):
    return Client.query.get(client_id)

def get_clients_by_user_id(user_id: str):
    return Client.query.filter_by(id_user=user_id).all()

# --- JOB ---
def create_job(value=None, short_desc=None, long_desc=None, date_start=None, date_stop=None,
               proximity=None, id_priority=None, id_status=None, id_user=None, id_client=None):
    job = Job(
        value=value, 
        short_desc=short_desc, 
        long_desc=long_desc,
        date_start=date_start, 
        date_stop=date_stop, 
        proximity=proximity,
        id_priority=id_priority, 
        id_status=id_status, 
        id_user=id_user, 
        id_client=id_client
    )
    db.session.add(job)
    db.session.commit()
    db.session.refresh(job)
    return job

def get_job_by_id(job_id):
    return Job.query.get(job_id)

def get_jobs_by_user_id(user_id):
    return Job.query.filter_by(id_user=user_id).all()

# --- STATUS / PRIORITY / TITLES ---
def get_all_statuses():
    return Status.query.all()

def get_all_priorities():
    return Priority.query.all()

def get_all_job_titles():
    return JobTitle.query.all()

# --- LINKS ---
def get_links_by_job(job_id):
    return Link.query.filter_by(id_job=job_id).all()

def delete_links_by_job(job_id):
    Link.query.filter_by(id_job=job_id).delete()
    db.session.commit()

def create_link(id_job, id_link_type, url):
    new_link = Link(id_job=id_job, id_link_type=id_link_type, url=url)
    db.session.add(new_link)
    db.session.commit()
    return new_link

# --- LOGS ---
def create_manual_log(id_job, start, stop):
    new_log = Log(id_job=id_job, start=start, stop=stop)
    db.session.add(new_log)
    db.session.commit()
    db.session.refresh(new_log)
    return new_log

def create_log(id_job, start):
    new_log = Log(id_job=id_job, start=start, stop=None)
    db.session.add(new_log)
    db.session.commit()
    db.session.refresh(new_log)
    return new_log

def get_logs_by_user(user_id):
    return db.session.query(Log).join(Job).filter(Job.id_user == user_id).all()

def get_logs_by_job(id_job):
    return Log.query.filter_by(id_job=id_job).all()