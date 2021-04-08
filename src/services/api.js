import axios from 'axios';

// cria uma conexão padrão, usando como base a url recebida
const api = axios.create({
  baseURL: 'http://localhost:3333/',
});

export default api;