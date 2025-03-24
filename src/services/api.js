import axios from 'axios';

const api = axios.create({
  /*baseURL: 'http://localhost:8081/GestionProyectoAPI/',*/
  baseURL: 'https://tarea.transforma.edu.sv/',
  withCredentials: true,  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


api.interceptors.response.use(
  response => response,
  error => {
    
    if (error.response && error.response.status === 401) {
      console.error('Sesión expirada o no iniciada. Redirigiendo a login...');
      
      localStorage.removeItem('user');  
    }
    return Promise.reject(error);
  }
);

export default api;