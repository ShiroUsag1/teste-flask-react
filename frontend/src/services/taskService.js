// src/services/taskService.js
import api from "./api";

export const buscarTarefas = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const atualizarStatus = async (id, status) => {
  const response = await api.put(`/tasks/${id}/status`, { status });
  return response.data;
};
