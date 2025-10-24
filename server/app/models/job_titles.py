from sqlalchemy.orm import relationship
from app import db

class JobTitle(db.Model):
    __tablename__ = "job_titles"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    name = db.Column(db.String(255))
    
    jobs = relationship("Job", back_populates="job_title")
