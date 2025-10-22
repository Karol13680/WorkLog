from passlib.context import CryptContext
from datetime import datetime, timedelta
from flask import current_app
import jwt

# Konfiguracja haszowania (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#  HASŁA 
def hash_password(password: str) -> str:
    """Haszuje podane hasło"""
    safe_password = password.encode('utf-8')[:72]
    return pwd_context.hash(safe_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Weryfikuje podane hasło z haszem"""
    safe_password = plain_password.encode('utf-8')[:72]
    return pwd_context.verify(safe_password, hashed_password)


#  TOKENY JWT (do logowania)
def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})

    secret_key = current_app.config.get("SECRET_KEY", "tymczasowy_klucz_dev")
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm="HS256")
    return encoded_jwt


def decode_access_token(token: str):
    secret_key = current_app.config.get("SECRET_KEY", "tymczasowy_klucz_dev")
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
