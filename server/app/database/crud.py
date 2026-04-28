from app.database.db import db
from datetime import datetime

def get_user_by_email(email: str):
    from app.models.users import User
    return User.query.filter_by(email=email).first()

def get_user_by_clerk_id(clerk_id: str):
    from app.models.users import User
    return User.query.filter_by(id=clerk_id).first()

def create_user(id: str, email: str, name: str, surname: str):
    from app.models.users import User
    db_user = User(id=id, email=email, name=name, surname=surname)
    db.session.add(db_user)
    db.session.commit()
    db.session.refresh(db_user)
    return db_user

def create_contact(email=None, phone=None, page=None, address=None):
    from app.models.contacts import Contact
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
    from app.models.contacts import Contact
    return Contact.query.filter_by(id=contact_id).first()

def create_client(name, description=None, logo=None, id_contact=None, id_user=None):
    from app.models.clients import Client
    client = Client(
        name=name,
        description=description,
        logo=logo,
        id_contact=id_contact,
        id_user=id_user
    )
    db.session.add(client)
    db.session.commit()
    db.session.refresh(client)
    return client

def get_client_by_id(client_id):
    from app.models.clients import Client
    return Client.query.filter_by(id=client_id).first()

def get_clients_by_user_id(user_id: str):
    from app.models.clients import Client
    return Client.query.filter_by(id_user=user_id).all()

def create_job(value=None, short_desc=None, long_desc=None, date_start=None, date_stop=None,
               proximity=None, id_priority=None, id_status=None, id_user=None, id_client=None):
    from app.models.jobs import Job
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
    from app.models.jobs import Job
    return Job.query.filter_by(id=job_id).first()

def get_jobs_by_user_id(user_id):
    from app.models.jobs import Job
    return Job.query.filter_by(id_user=user_id).all()

def get_status_by_id(status_id):
    from app.models.status import Status
    return Status.query.filter_by(id=status_id).first()

def get_all_statuses():
    from app.models.status import Status
    return Status.query.all()

def get_all_priorities():
    from app.models.priorities import Priority
    return Priority.query.all()

def get_all_job_titles():
    from app.models.job_titles import JobTitle
    return JobTitle.query.all()

def get_links_by_job(job_id):
    from app.models.links import Link
    return Link.query.filter_by(id_job=job_id).all()

def delete_links_by_job(job_id):
    from app.models.links import Link
    Link.query.filter_by(id_job=job_id).delete()
    db.session.commit()

def create_link(id_job, id_link_type, url):
    from app.models.links import Link
    new_link = Link(id_job=id_job, id_link_type=id_link_type, url=url)
    db.session.add(new_link)
    db.session.commit()
    return new_link

def create_manual_log(id_job, start, stop):
    from app.models.logs import Log
    new_log = Log(
        id_job=id_job,
        start=start,
        stop=stop
    )
    db.session.add(new_log)
    db.session.commit()
    db.session.refresh(new_log)
    return new_log

def create_log(id_job, start):
    from app.models.logs import Log
    new_log = Log(
        id_job=id_job,
        start=start,
        stop=None
    )
    db.session.add(new_log)
    db.session.commit()
    db.session.refresh(new_log)
    return new_log

def get_log_by_id(log_id):
    from app.models.logs import Log
    return Log.query.get(log_id)

def get_logs_by_user(user_id):
    from app.models.logs import Log
    from app.models.jobs import Job
    return db.session.query(Log).join(Job).filter(Job.id_user == user_id).all()

def get_logs_by_job(id_job):
    from app.models.logs import Log
    return Log.query.filter_by(id_job=id_job).all()

def get_completed_logs_by_job(id_job):
    from app.models.logs import Log
    return Log.query.filter_by(id_job=id_job).filter(Log.stop.isnot(None)).all()

def get_log_by_id(log_id):
    from app.models.logs import Log
    return Log.query.get(log_id)

def delete_links_by_job(job_id):
    from app.models.links import Link
    Link.query.filter_by(id_job=job_id).delete()
    db.session.commit()

def create_link(id_job, id_link_type, url):
    from app.models.links import Link
    new_link = Link(id_job=id_job, id_link_type=id_link_type, url=url)
    db.session.add(new_link)
    db.session.commit()
    return new_link