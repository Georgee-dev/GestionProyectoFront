
import api from './api';

export const getUsuarios = async () => {
  try {
    
    const response = await api.get('/?url=Usuarios/usuarios/');
    
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.success && Array.isArray(response.data.usuarios)) {
      return response.data.usuarios;
    } else {
      console.warn('Respuesta inesperada en getUsuarios:', response.data);
      
      
      return [
        { id: 5, nombres: "TEST", apellidos: "Vásquez", rol: "Cliente" },
        { id: 6, nombres: "Josué", apellidos: "Rodríguez", rol: "Gerente" },
        { id: 7, nombres: "prueba", apellidos: "prueba", rol: "Cliente" }
      ];
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    
    
    return [
      { id: 5, nombres: "TEST", apellidos: "Vásquez", rol: "Cliente" },
      { id: 6, nombres: "Josué", apellidos: "Rodríguez", rol: "Gerente" },
      { id: 7, nombres: "prueba", apellidos: "prueba", rol: "Cliente" }
    ];
  }
};

export const getUsuario = async (id) => {
  try {
    const response = await api.get(`/?url=Usuarios/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario ${id}:`, error);
    throw error;
  }
};