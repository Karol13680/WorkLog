from sqlalchemy.orm import relationship
from app import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    name = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    hashed_password = db.Column(db.Text)
    email = db.Column(db.String(255), unique=True)

    jobs = relationship("Job", back_populates="user")
    clients = relationship("Client", back_populates="user")