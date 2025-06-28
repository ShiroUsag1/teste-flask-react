import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Tasks() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    buscarTarefas();
  }, []);

  const buscarTarefas = () => {
    api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTarefas(res.data))
      .catch(() => alert("Erro ao buscar tarefas"));
  };

  const criarTarefa = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return alert("Título é obrigatório.");
    try {
      await api.post("/tasks", { titulo, descricao }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitulo("");
      setDescricao("");
      buscarTarefas();
    } catch {
      alert("Erro ao criar tarefa.");
    }
  };

  const deletarTarefa = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      buscarTarefas();
    } catch {
      alert("Erro ao deletar.");
    }
  };

  const tarefasFiltradas = tarefas
    .filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()))
    .filter((t) => statusFiltro === "todos" || t.status === statusFiltro);

  return (
    <div>
      <h1>Minhas Tarefas</h1>

      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/");
      }}>Sair</button>

      <form onSubmit={criarTarefa}>
        <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} /><br />
        <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea><br />
        <button type="submit">Criar</button>
      </form>

      <input placeholder="Buscar..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}>
        <option value="todos">Todos</option>
        <option value="pendente">Pendentes</option>
        <option value="concluido">Concluídas</option>
      </select>

      <ul>
        {tarefasFiltradas.map((t) => (
          <li key={t.id}>
            <strong>{t.titulo}</strong>: {t.descricao} - {t.status}
            <button onClick={() => deletarTarefa(t.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
