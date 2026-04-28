from sqlalchemy.orm import relationship
from app.database.db import db

class LinkType(db.Model):
    __tablename__ = "links_type"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    name = db.Column(db.String(255))
    
    links = relationship("Link", back_populates="link_type")
