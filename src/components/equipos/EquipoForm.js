
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getUsuarios } from '../../services/usuarios';
import toast from 'react-hot-toast';

export default function EquipoForm({ onSubmit, initialData = {}, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadResponsables = async () => {
      setLoading(true);
      try {
        const data = await getUsuarios();
        console.log("Respuesta de usuarios para responsables:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          setResponsables(data);
        } else if (data && data.success && data.usuarios) {
          setResponsables(data.usuarios);
        } else {
          
          setResponsables([
            { id: 5, nombres: "TEST", apellidos: "Vásquez" },
            { id: 6, nombres: "Josué", apellidos: "Rodríguez" },
            { id: 7, nombres: "prueba", apellidos: "prueba" }
          ]);
        }
      } catch (error) {
        console.error('Error al cargar responsables:', error);
        toast.error('No se pudieron cargar los responsables');
        
        setResponsables([
          { id: 5, nombres: "TEST", apellidos: "Vásquez" },
          { id: 6, nombres: "Josué", apellidos: "Rodríguez" },
          { id: 7, nombres: "prueba", apellidos: "prueba" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadResponsables();
  }, []);

  
  const processFormSubmit = (data) => {
    console.log("Datos del formulario de equipo:", data);
    
    
    if (!data.nombre || !data.id_responsable) {
      toast.error('Todos los campos son requeridos');
      return;
    }
    
    
    const formattedData = {
      id_responsable: parseInt(data.id_responsable, 10),
      nombre: data.nombre.trim()
      
    };
    
    console.log("Datos formateados de equipo:", formattedData);
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Responsable</label>
        <select
          {...register('id_responsable', { required: 'El responsable es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting || loading}
        >
          <option value="">Selecciona un responsable</option>
          {loading ? (
            <option value="" disabled>Cargando responsables...</option>
          ) : responsables.length > 0 ? (
            responsables.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombres} {usuario.apellidos}
              </option>
            ))
          ) : (
            <option value="" disabled>No hay responsables disponibles</option>
          )}
        </select>
        {errors.id_responsable && <p className="text-red-500 text-xs mt-1">{errors.id_responsable.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Equipo</label>
        <input
          type="text"
          {...register('nombre', { required: 'El nombre es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          {...register('estado')}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      
      <div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Procesando...' 
            : initialData.id 
              ? 'Actualizar Equipo' 
              : 'Crear Equipo'
          }
        </button>
      </div>
    </form>
  );
}