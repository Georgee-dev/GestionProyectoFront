'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { asignarResponsable } from '../../services/tareas';
import { getUsuarios } from '../../services/usuarios';
import toast from 'react-hot-toast';

export default function AsignarResponsableForm({ tareaId, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { id_tarea: tareaId }
  });
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const data = await getUsuarios();
        console.log("Usuarios obtenidos:", data);
        
        let usuariosArray = [];
        
        if (Array.isArray(data)) {
          usuariosArray = data;
        } else if (data && data.success && Array.isArray(data.usuarios)) {
          usuariosArray = data.usuarios;
        } else {
          console.warn("Formato de datos de usuarios inesperado:", data);
          // Fallback
          usuariosArray = [
            { id: 5, nombres: "TEST", apellidos: "Vásquez" },
            { id: 6, nombres: "Josué", apellidos: "Rodríguez" },
            { id: 7, nombres: "prueba", apellidos: "prueba" }
          ];
        }
        
        setUsuarios(usuariosArray);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast.error('No se pudieron cargar los usuarios');
        // Fallback
        setUsuarios([
          { id: 5, nombres: "TEST", apellidos: "Vásquez" },
          { id: 6, nombres: "Josué", apellidos: "Rodríguez" },
          { id: 7, nombres: "prueba", apellidos: "prueba" }
        ]);
      }
    };

    loadUsuarios();
  }, []);

  const onSubmit = async (data) => {
    console.log("Datos a enviar para asignar responsable:", data);
    
    if (!data.id_responsable || !tareaId) {
      toast.error('Por favor selecciona un responsable y una tarea');
      return;
    }
    
    setIsLoading(true);
    try {
      const formattedData = {
        id_tarea: parseInt(tareaId, 10),
        id_responsable: parseInt(data.id_responsable, 10)
      };
      
      console.log("Datos formateados para asignar:", formattedData);
      const response = await asignarResponsable(formattedData);
      
      if (response.success) {
        toast.success('Responsable asignado con éxito');
        if (onSuccess) onSuccess(response);
      } else {
        toast.error(response.message || 'Error al asignar responsable');
      }
    } catch (error) {
      console.error('Error al asignar responsable:', error);
      toast.error('Error al asignar responsable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Responsable</label>
        <select
          {...register('id_responsable', { required: 'El responsable es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isLoading}
        >
          <option value="">Seleccione un responsable</option>
          {usuarios.length > 0 ? (
            usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombres} {usuario.apellidos}
              </option>
            ))
          ) : (
            <option value="" disabled>No hay usuarios disponibles</option>
          )}
        </select>
        {errors.id_responsable && (
          <p className="text-red-500 text-xs mt-1">{errors.id_responsable.message}</p>
        )}
      </div>
      
      <input type="hidden" {...register('id_tarea')} value={tareaId} />
      
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Asignando...' : 'Asignar Responsable'}
        </button>
      </div>
    </form>
  );
}