import api from './api';

export const getEquipos = async () => {
  try {
    const response = await api.get('?url=Equipo/equipos');
    const data = response.data;
    
    if (data && data.equipos) {
      return data.equipos;
    } else if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    return [];
  }
};

export const getEquipo = async (id) => {
  try {
    console.log('Solicitando equipo con ID:', id);
    
   
    const equipoId = String(id).trim();
    
    
    const url = `?url=Equipo/equipos/${equipoId}`;
    console.log('URL a usar:', url);
    
    const response = await api.get(url);
    console.log('Respuesta completa:', response);
    
    return response.data;
  } catch (error) {
    console.error(`Error al obtener equipo ${id}:`, error);
    
    if (error.response) {
      console.error('Datos del error:', error.response.data);
    }
    
    
    return {
      id: id,
      nombre: "Equipo Temporal",
      id_responsable: 1,
      estado: "Activo"
    };
  }
};

export const createEquipo = async (data) => {
  try {
    
    const formattedData = {
      id_responsable: parseInt(data.id_responsable, 10),
      nombre: data.nombre,
      estado: data.estado || 'Activo'
    };
    
    console.log('Datos a enviar (equipo):', formattedData);
    
    const response = await api.post('?url=Equipo/equipos', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error al crear equipo:', error);
    throw error;
  }
};

export const updateEquipo = async (id, data) => {
  try {
    
    const formattedData = {
      id_responsable: parseInt(data.id_responsable, 10),
      nombre: data.nombre,
      estado: data.estado || 'Activo'
    };
    
    console.log('Actualizando equipo con ID:', id, 'Datos:', formattedData);
    
    const response = await api.put(`?url=Equipo/equipos/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar equipo ${id}:`, error);
    throw error;
  }
};

export const deleteEquipo = async (id) => {
  try {
    console.log('Eliminando equipo con ID:', id);
    
    const response = await api.delete(`?url=Equipo/equipos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar equipo ${id}:`, error);
    throw error;
  }
};