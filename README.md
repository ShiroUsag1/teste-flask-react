# 🧠 Sistema Full Stack com Flask + React

Este projeto é um sistema completo de gerenciamento de tarefas com autenticação, feito para fins de estudo e entrevistas técnicas.

---

## 🛠️ Tecnologias Utilizadas

### 🔙 Backend:
- Python 3 + Flask
- Flask-SQLAlchemy + Flask-Migrate
- Flask-CORS
- JWT para autenticação
- MySQL como banco de dados

### 🔜 Frontend:
- React (com Vite)
- React Router DOM
- Axios
- Validações e proteção de rotas

---

## 🚀 Como Executar Localmente

### 🔧 Pré-requisitos

- Python 3.10+
- MySQL instalado e rodando localmente
- Node.js 18+

---

## ⚙️ Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 🗃️ Banco de dados

No MySQL, crie o banco:

```sql
CREATE DATABASE gerenciador_tarefas;
```

Depois rode as migrações:

```bash
flask db init
flask db migrate -m "init"
flask db upgrade
```

E inicie o servidor:

```bash
flask run
```

---

## 🎨 Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Funcionalidades

- Autenticação com JWT
- Cadastro e login de usuários
- Criação, listagem, filtro e exclusão de tarefas
- Filtro por título e status (pendente/concluído)
- Proteção de rotas
- Logout

---

## 📁 Estrutura do Projeto

```
fullstack-flask-react/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   └── requirements.txt
├── frontend/
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Tasks.jsx
│       └── services/
│           └── api.js
```

---

## 👨‍💻 Autor

Projeto criado por Ádria Almeida como simulação de teste prático para vaga Full Stack.
