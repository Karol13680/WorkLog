
#import bluprintów
from .hello import hello_bp
from .main import main_bp

#rejestracja bluprintów
def register_routes(app):
    app.register_blueprint(main_bp)
    app.register_blueprint(hello_bp)

