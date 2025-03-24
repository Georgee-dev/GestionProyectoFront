'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { crearTarea } from '../../services/tareas';
import { getProyectos } from '../../services/proyectos';
import toast from 'react-hot-toast';

export default function TareaForm({ onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProyectos = async () => {
      try {
        const data = await getProyectos();
        console.log("Proyectos obtenidos:", data);
        setProyectos(Array.isArray(data) ? data : (data?.proyectos || []));
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        toast.error('No se pudieron cargar los proyectos');
        setProyectos([]);
      }
    };

    loadProyectos();
  }, []);

 
// components/tareas/TareaForm.js - Actualiza la función onSubmit
const onSubmit = async (data) => {
  console.log("Datos del formulario de tarea:", data);
  
  if (!data.id_proyecto || !data.tarea) {
    toast.error('El proyecto y la descripción son requeridos');
    return;
  }
  
  
  const formattedData = {
    id_proyecto: Number(data.id_proyecto),
    tarea: data.tarea,
    estado: data.estado || 'Pendiente'
  };
  
  console.log("Datos formateados de tarea:", formattedData);
  
  setIsLoading(true);
  try {
    const response = await crearTarea(formattedData);
    console.log('Respuesta de crear tarea:', response);
    
    if (response && response.success) {
      toast.success('Tarea creada con éxito');
      reset(); 
      if (onSuccess) {
        onSuccess(response);
      }
    } else {
      toast.error(response?.message || 'Error al crear la tarea');
    }
  } catch (error) {
    console.error('Error al crear tarea:', error);
    toast.error('Error al crear la tarea');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Proyecto</label>
        <select
          {...register('id_proyecto', { required: 'El proyecto es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isLoading}
        >
          <option value="">Seleccione un proyecto</option>
          {proyectos.length > 0 ? (
            proyectos.map(proyecto => (
              <option key={proyecto.id} value={proyecto.id}>{proyecto.nombre}</option>
            ))
          ) : (
            <option value="" disabled>Cargando proyectos...</option>
          )}
        </select>
        {errors.id_proyecto && <p className="text-red-500 text-xs mt-1">{errors.id_proyecto.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción de la tarea</label>
        <input
          type="text"
          {...register('tarea', { required: 'La descripción es requerida' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isLoading}
        />
        {errors.tarea && <p className="text-red-500 text-xs mt-1">{errors.tarea.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          {...register('estado', { required: 'El estado es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isLoading}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Progreso">En Progreso</option>
          <option value="Finalizada">Finalizada</option>
        </select>
        {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>}
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Creando...' : 'Crear Tarea'}
        </button>
      </div>
    </form>
  );
}