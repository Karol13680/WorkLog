from flask import Blueprint, request, jsonify
from app.database import crud
import os

webhooks_bp = Blueprint("webhooks", __name__, url_prefix="/webhooks")

@webhooks_bp.route("/clerk", methods=["POST"])
def clerk_webhook():
    data = request.get_json()
    
    # Clerk wysyła typ zdarzenia w polu 'type'
    event_type = data.get("type")
    
    if event_type == "user.created":
        user_data = data.get("data", {})
        clerk_id = user_data.get("id")
        
        # Wyciągamy email (Clerk przesyła to w liście)
        email_addresses = user_data.get("email_addresses", [])
        email = email_addresses[0].get("email_address") if email_addresses else None
        
        name = user_data.get("first_name", "")
        surname = user_data.get("last_name", "")

        # Sprawdzamy czy użytkownik już istnieje
        if not crud.get_user_by_clerk_id(clerk_id):
            crud.create_user(id=clerk_id, email=email, name=name, surname=surname)
            return jsonify({"message": "User created in DB"}), 201
            
    return jsonify({"message": "Event ignored"}), 200