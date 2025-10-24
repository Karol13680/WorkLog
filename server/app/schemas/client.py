from pydantic import BaseModel
from typing import Optional

class Contact(BaseModel):
    id: int
    email: Optional[str]
    phone: Optional[str]
    page: Optional[str]
    address: Optional[str]

    class Config:
        orm_mode = True


class Client(BaseModel):
    id: int
    name: str
    description: Optional[str]
    logo: Optional[str]
    id_contact: int
    contact: Optional[Contact] = None

    class Config:
        orm_mode = True
