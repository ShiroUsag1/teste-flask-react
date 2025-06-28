import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return alert("Preencha todos os campos");
    if (!email.includes("@")) return alert("E-mail inválido");
    if (senha.length < 6) return alert("Senha deve ter no mínimo 6 caracteres");

    try {
      await api.post("/register", { nome, email, senha });
      alert("Cadastro realizado!");
      navigate("/");
    } catch {
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} /><br />
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} /><br />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
