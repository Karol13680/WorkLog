from app import db
from app.models.users import User as UserModel
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_user_by_email(email: str):
    """Pobiera użytkownika na podstawie adresu e-mail."""
    return UserModel.query.filter_by(email=email).first()

def create_user(user_data: UserCreate):
    """Tworzy nowego użytkownika, haszuje hasło i zapisuje w bazie."""
    
    hashed_pass = hash_password(user_data.password)
    
    db_user = UserModel(
        email=user_data.email,
        name=user_data.name,
        surname=user_data.surname,
        hashed_password=hashed_pass
    )
    
    db.session.add(db_user)
    db.session.commit()
    return db_user