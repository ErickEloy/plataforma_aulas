import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Altere para a URL do seu backend
});

export default api; // Garantir que o arquivo seja tratado como módulo
