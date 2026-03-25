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
        jwks_url = os.environ.get("CLERK_JWKS_URL")
        print(f"DEBUG: Próba połączenia z: {jwks_url}")
        
        jwks_client = PyJWKClient(jwks_url)
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
        print(f"[Security Error]: {e}")
        return None