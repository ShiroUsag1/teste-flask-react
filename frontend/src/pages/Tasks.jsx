import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { atualizarStatus } from "../services/taskService";
import api from "../services/api";

export default function Tasks() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTarefas(res.data);
    } catch (err) {
      alert("Erro ao buscar tarefas");
    } finally {
      setCarregando(false);
    }
  };

  const criarTarefa = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return alert("Título é obrigatório.");
    try {
      await api.post(
        "/tasks",
        { titulo, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitulo("");
      setDescricao("");
      carregarTarefas();
    } catch {
      alert("Erro ao criar tarefa.");
    }
  };

  const deletarTarefa = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirmar) return;

    try {
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      carregarTarefas();
    } catch (err) {
      alert("Erro ao excluir tarefa");
    }
  };

  const alternarStatus = async (tarefa) => {
    const novoStatus = tarefa.status === "pendente" ? "concluida" : "pendente";
    try {
      await atualizarStatus(tarefa.id, novoStatus);
      carregarTarefas();
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  };

  const tarefasFiltradas = tarefas
    .filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()))
    .filter((t) => statusFiltro === "todos" || t.status === statusFiltro);

  return (
    <div>
      <h1>Minhas Tarefas</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Sair
      </button>

      <form onSubmit={criarTarefa}>
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>
        <br />
        <button type="submit">Criar</button>
      </form>

      <input
        placeholder="Buscar..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      <select
        value={statusFiltro}
        onChange={(e) => setStatusFiltro(e.target.value)}
      >
        <option value="todos">Todos</option>
        <option value="pendente">Pendentes</option>
        <option value="concluida">Concluídas</option>
      </select>

      <ul>
        {carregando ? (
          <li>Carregando tarefas...</li>
        ) : tarefasFiltradas.length === 0 ? (
          <li>Nenhuma tarefa encontrada</li>
        ) : (
          tarefasFiltradas.map((t) => (
            <li key={t.id}>
              <strong>{t.titulo}</strong>: {t.descricao} - {t.status}
              <button onClick={() => alternarStatus(t)}>
                {t.status === "pendente" ? "Concluir" : "Reabrir"}
              </button>
              <button
                onClick={() => deletarTarefa(t.id)}
                style={{ color: "red", marginLeft: "10px" }}
              >
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
