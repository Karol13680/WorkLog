from app import create_app
from app.database.db import db

app = create_app()

# Inicjalizacja bazy danych przed startem
with app.app_context():
    db.create_all()

# To musi być poza 'if __name__ == "__main__":' dla pewności w kontenerze
app.run(
    host="0.0.0.0",
    port=5000,
    debug=False
)