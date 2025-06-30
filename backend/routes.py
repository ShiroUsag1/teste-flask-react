from flask import Blueprint, request, jsonify
from models import db, User, Task
from werkzeug.security import generate_password_hash, check_password_hash
import jwt as pyjwt
import datetime
from functools import wraps
from flask import current_app as app

app_routes = Blueprint("app_routes", __name__)


# Função para verificar o token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            bearer = request.headers["Authorization"]
            token = bearer.split()[1] if " " in bearer else bearer

        if not token:
            return jsonify({"message": "Token ausente!"}), 401

        try:
            data = pyjwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
        except:
            return jsonify({"message": "Token inválido!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# Rota de cadastro
@app_routes.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email já cadastrado!"}), 400

    hashed_password = generate_password_hash(data["senha"], method="pbkdf2:sha256")
    novo_usuario = User(nome=data["nome"], email=data["email"], senha=hashed_password)
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário criado com sucesso!"})


# Rota de login
@app_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    usuario = User.query.filter_by(email=data["email"]).first()

    if not usuario or not check_password_hash(usuario.senha, data["senha"]):
        return jsonify({"message": "Credenciais inválidas!"}), 401

    token = pyjwt.encode(
        {
            "user_id": usuario.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        },
        app.config["SECRET_KEY"],
        algorithm="HS256",
    )

    return jsonify({"token": token})


# CRUD de tarefas
@app_routes.route("/tasks", methods=["GET"])
@token_required
def listar_tarefas(usuario):
    tarefas = Task.query.filter_by(user_id=usuario.id).all()
    return jsonify(
        [
            {
                "id": t.id,
                "titulo": t.titulo,
                "descricao": t.descricao,
                "status": t.status,
            }
            for t in tarefas
        ]
    )


@app_routes.route("/tasks", methods=["POST"])
@token_required
def criar_tarefa(usuario):
    data = request.json
    nova = Task(
        titulo=data["titulo"], descricao=data.get("descricao", ""), user_id=usuario.id
    )
    db.session.add(nova)
    db.session.commit()
    return jsonify({"message": "Tarefa criada com sucesso!"})


@app_routes.route("/tasks/<int:id>", methods=["DELETE"])
@token_required
def deletar_tarefa(usuario, id):
    tarefa = Task.query.get_or_404(id)
    if tarefa.user_id != usuario.id:
        return jsonify({"message": "Acesso negado!"}), 403
    db.session.delete(tarefa)
    db.session.commit()
    return jsonify({"message": "Tarefa excluída com sucesso!"})


@app_routes.route("/tasks/<int:task_id>/status", methods=["PUT"])
def atualizar_status(task_id):
    data = request.get_json()
    novo_status = data.get("status")

    if novo_status not in ["pendente", "concluida"]:
        return jsonify({"message": "Status inválido!"}), 400

    tarefa = Task.query.get(task_id)

    if not tarefa:
        return jsonify({"message": "Tarefa não encontrada!"}), 404

    tarefa.status = novo_status
    db.session.commit()

    return jsonify({"message": "Status da tarefa atualizado com sucesso!"})
