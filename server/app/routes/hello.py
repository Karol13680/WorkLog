# app/routes/hello.py
from flask import Blueprint, jsonify

hello_bp = Blueprint('hello', __name__, url_prefix='/api')

@hello_bp.route('/hello', methods=['GET'])
def hello_api():
    return jsonify({"message": "Witaj z API!"})
