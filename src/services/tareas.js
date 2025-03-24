import api from '@/api';


export const crearTarea = async (data) => {
  try {
    
    const formattedData = {
      id_proyecto: Number(data.id_proyecto),
      tarea: data.tarea,
      estado: data.estado || 'Pendiente'
    };
    
    console.log('Enviando datos para crear tarea:', formattedData);
    
    const response = await api.post('/?url=Tareas/crear', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error al crear tarea:', error);
    
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
  }
};

export const asignarResponsable = async (data) => {
  try {
    
    const formattedData = {
      id_tarea: parseInt(data.id_tarea, 10),
      id_responsable: parseInt(data.id_responsable, 10)
    };
    
    const response = await api.post('?url=TareaResponsables/asignarResponsable', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error al asignar responsable:', error);
    throw error;
  }
};


export const getTareasAsignadas = async () => {
  try {
    const response = await api.get('?url=TareasAsignadas/obtener');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tareas asignadas:', error);
    return { success: false, message: 'Error al cargar tareas', tareas: [] };
  }
};

export const registrarProgresoTarea = async (data) => {
  try {
    
    const formattedData = {
      id_tarea: parseInt(data.id_tarea, 10),
      comentario: data.comentario,
      last_estado: data.last_estado,
      new_estado: data.new_estado
    };
    
    const response = await api.post('?url=TareasProgreso/registrar', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar progreso:', error);
    throw error;
  }
};

export const getProgresoTarea = async (idTarea) => {
  try {
    const response = await api.get(`?url=TareasProgreso/obtener&id_tarea=${idTarea}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener progreso de tarea ${idTarea}:`, error);
    throw error;
  }
};

export const getTareasByProyecto = async (idProyecto) => {
  try {
    const response = await api.get(`?url=Tareas/proyecto/${idProyecto}`);
    return response.data.tareas || [];
  } catch (error) {
    console.error(`Error al obtener tareas del proyecto ${idProyecto}:`, error);
    return [];
  }
};

export const actualizarProgresoTarea = async (data) => {
  try {
    const formattedData = {
      id: parseInt(data.id, 10),
      comentario: data.comentario,
      last_estado: data.last_estado,
      new_estado: data.new_estado
    };
    
    const response = await api.put('?url=TareasProgreso/actualizar', formattedData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    throw error;
  }
};