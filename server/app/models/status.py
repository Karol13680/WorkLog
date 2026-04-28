from sqlalchemy.orm import relationship
from app.database.db import db

class Status(db.Model):
    __tablename__ = "status"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    name = db.Column(db.String(255))
    
    jobs = relationship('Job', back_populates='status')