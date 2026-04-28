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
        jwks_url = os.getenv("CLERK_JWKS_URL", "")
        
        if not jwks_url:
            print("[Security Error]: Brak CLERK_JWKS_URL!")
            return None

        # TUTAJ POPRAWKA: Dodajemy nagłówek User-Agent, żeby Clerk nas nie odrzucał
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        jwks_client = PyJWKClient(jwks_url, headers=headers)
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False}
        )

        clerk_id = payload.get("sub")
        
        from app.database import crud
        user = crud.get_user_by_clerk_id(clerk_id)
        
        if not user:
            email = payload.get("email") or f"{clerk_id}@clerk.user"
            crud.create_user(id=clerk_id, email=email, name="User", surname="Clerk")
        
        return clerk_id

    except Exception as e:
        print(f"[Security Error]: Fail to fetch data from the url, err: {e}")
        return None