import os
import jwt
from flask import request
from jwt import PyJWKClient

def get_current_user_id():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]
    
    try:
        # Pobieramy URL. Jeśli go nie ma, używamy pustego stringa, żeby uniknąć błędu 'None'
        jwks_url = os.getenv("CLERK_JWKS_URL", "")
        
        if not jwks_url:
            print("[Security Error]: Brak CLERK_JWKS_URL w zmiennych środowiskowych!")
            return None

        # Cache'owanie kluczy (opcjonalnie, ale przyspiesza działanie)
        jwks_client = PyJWKClient(jwks_url)
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )

        clerk_id = payload.get("sub")
        
        # Importy wewnątrz funkcji, żeby uniknąć cyklicznych zależności
        from app.database import crud
        user = crud.get_user_by_clerk_id(clerk_id)
        
        if not user:
            # Tworzymy użytkownika, jeśli go nie ma w naszej bazie
            email = payload.get("email") or f"{clerk_id}@clerk.user"
            crud.create_user(id=clerk_id, email=email, name="User", surname="Clerk")
        
        return clerk_id

    except Exception as e:
        print(f"[Security Error]: {e}")
        return None