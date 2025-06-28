from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from routes import app_routes

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:SENHA@localhost/gerenciador_tarefas'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'chave-secreta'

CORS(app)
db.init_app(app)
Migrate(app, db)
app.register_blueprint(app_routes, url_prefix="/api")

if __name__ == '__main__':
    app.run(debug=True)
