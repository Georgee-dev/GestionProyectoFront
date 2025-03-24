
import api from './api';

export const login = async (credentials) => {
  try {
    console.log('Intentando iniciar sesión con:', credentials);
    
    
    const loginData = {
      email: credentials.email,
      contra: credentials.contra
    };
    
    const response = await api.post('?url=Login/login', loginData);
    
    
    if (response.data && response.data.id) {
      
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('Inicio de sesión exitoso:', response.data);
      return { success: true, user: response.data };
    } else if (response.data && response.data.success === false) {
      
      console.error('Error de inicio de sesión:', response.data.message);
      return { 
        success: false, 
        message: response.data.message || 'Credenciales inválidas'
      };
    } else {
     
      console.error('Respuesta inesperada del servidor:', response.data);
      return { 
        success: false, 
        message: 'Error inesperado al iniciar sesión'
      };
    }
  } catch (error) {
    console.error('Error completo de inicio de sesión:', error);
    
    
    const errorMessage = error.response?.data?.message || 'Error al conectar con el servidor';
    return { 
      success: false, 
      message: errorMessage
    };
  }
};

export const logout = async () => {
  try {
    
    await api.post('?url=Login/logOut');
    
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    
    localStorage.removeItem('user');
    return { success: true };
  }
};