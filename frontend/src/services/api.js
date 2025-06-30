import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"  // Coloque a porta onde o Flask está rodando
});

export default api;
