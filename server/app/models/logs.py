from sqlalchemy.orm import relationship
from app.database.db import db

class Log(db.Model):
    __tablename__ = "logs"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    
    id_job = db.Column(db.Integer, db.ForeignKey("jobs.id"))
    
    start = db.Column(db.TIMESTAMP)
    stop = db.Column(db.TIMESTAMP)
    
    job = relationship("Job", back_populates="logs")
