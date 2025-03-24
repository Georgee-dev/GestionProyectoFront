import api from './api';

export const getProyectos = async () => {
  try {
    const response = await api.get('?url=Proyectos/proyectos');
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Respuesta inesperada en getProyectos:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
};

export const getProyecto = async (id) => {
  try {
    const response = await api.get(`?url=Proyectos/proyectos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener proyecto ${id}:`, error);
    throw error;
  }
};

export const createProyecto = async (data) => {
  try {
    const formattedData = {
      id_cliente: Number(data.id_cliente),
      id_equipo: Number(data.id_equipo),
      fecha_entrega: data.fecha_entrega,
      nombre: data.nombre,
      estado: "Activo"  
    };
    
    console.log('Datos enviados a la API:', formattedData);
    
    const response = await api.post('?url=Proyectos/proyectos', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
};

export const updateProyecto = async (id, data) => {
  try {
    console.log(`Actualizando proyecto ${id} con datos:`, data);
    
    
    const formattedData = {
      id_cliente: parseInt(data.id_cliente, 10),
      id_equipo: parseInt(data.id_equipo, 10),
      nombre: data.nombre,
      fecha_entrega: data.fecha_entrega,
      estado: data.estado || 'Activo'
    };
    
    console.log('Datos formateados para actualizar:', formattedData);
    
    const response = await api.put(`?url=Proyectos/proyectos/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar proyecto ${id}:`, error);
    throw error;
  }
};

export const deleteProyecto = async (id) => {
  try {
    const response = await api.delete(`?url=Proyectos/proyectos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar proyecto ${id}:`, error);
    throw error;
  }
};

export const getProyectosAsignados = async () => {
  try {
    const response = await api.get('?url=ProyectosAsignados/obtener');
    return response.data;
  } catch (error) {
    console.error('Error al obtener proyectos asignados:', error);
    return { success: false, message: 'Error al cargar proyectos', proyectos: [] };
  }
};