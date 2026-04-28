from sqlalchemy.orm import relationship
from app.database.db import db

class Client(db.Model):
    __tablename__ = "clients"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    logo = db.Column(db.Text)
    
    id_contact = db.Column(db.Integer, db.ForeignKey("contacts.id"), unique=True)
    # Ustawiamy id_user (zamiast user_id)
    id_user = db.Column(db.String(255), db.ForeignKey("users.id"), nullable=False)

    contact = relationship("Contact", back_populates="client")
    jobs = relationship("Job", back_populates="client")
    user = relationship("User", back_populates="clients")