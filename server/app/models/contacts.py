from sqlalchemy.orm import relationship
from app import db

class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(255))
    page = db.Column(db.Text)
    address = db.Column(db.Text)
    
    client = relationship("Client", back_populates="contact", uselist=False)
