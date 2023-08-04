from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/delfin'  # Configura la base de datos SQLite (puedes cambiarla a otro motor de base de datos)
app.config['API_BASE_URL'] = 'http://localhost:3306'

db = SQLAlchemy(app)

# Resto de tu código...
