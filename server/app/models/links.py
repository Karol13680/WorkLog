from sqlalchemy.orm import relationship
from app import db

class Link(db.Model):
    __tablename__ = "links"

    id = db.Column(db.Integer, primary_key=True, unique=True, index=True, autoincrement=True)
    url = db.Column(db.Text)
    
    id_job = db.Column(db.Integer, db.ForeignKey("jobs.id"))
    id_link_type = db.Column(db.Integer, db.ForeignKey("links_type.id"))
    
    job = relationship("Job", back_populates="links")
    link_type = relationship("LinkType", back_populates="links")
