import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) return alert("Preencha todos os campos!");

    try {
      const resposta = await api.post("/login", { email, senha });
      localStorage.setItem("token", resposta.data.token);
      navigate("/tasks");
    } catch {
      alert("Email ou senha inválidos.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} /><br />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem conta? <a href="/register">Cadastre-se aqui</a></p>
    </div>
  );
}
