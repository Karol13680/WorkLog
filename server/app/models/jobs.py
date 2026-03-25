from sqlalchemy.orm import relationship
from app.extensions import db

class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    value = db.Column(db.Float)
    short_desc = db.Column(db.Text)
    long_desc = db.Column(db.Text)
    date_start = db.Column(db.TIMESTAMP)
    date_stop = db.Column(db.TIMESTAMP)
    proximity = db.Column(db.Integer)

    id_priority = db.Column(db.Integer, db.ForeignKey("priorities.id"))
    id_titles = db.Column(db.Integer, db.ForeignKey("job_titles.id"))
    id_status = db.Column(db.Integer, db.ForeignKey("status.id"))
    id_user = db.Column(db.String(255), db.ForeignKey("users.id"))
    id_client = db.Column(db.Integer, db.ForeignKey("clients.id"))

    user = relationship("User", back_populates="jobs")
    priority = relationship("Priority", back_populates="jobs")
    job_title = relationship("JobTitle", back_populates="jobs")
    status = relationship("Status", back_populates="jobs")
    client = relationship("Client", back_populates="jobs")
    logs = relationship("Log", back_populates="job")
    links = relationship("Link", back_populates="job")