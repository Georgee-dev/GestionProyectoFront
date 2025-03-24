import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getUsuarios } from '../../services/usuarios';
import toast from 'react-hot-toast';

export default function ProyectoForm({ onSubmit, initialData = {}, equipos = [], isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsuarios();
        
        const clientesData = Array.isArray(data) 
          ? data.filter(u => u.rol === 'Cliente')
          : [];
        
        setClientes(clientesData.length > 0 ? clientesData : [
          { id: 5, nombres: "TEST", apellidos: "Vásquez" },
          { id: 6, nombres: "Josué", apellidos: "Rodríguez" },
          { id: 7, nombres: "prueba", apellidos: "prueba" }
        ]);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        setError('No se pudieron cargar los clientes');
        
        setClientes([
          { id: 5, nombres: "TEST", apellidos: "Vásquez" },
          { id: 6, nombres: "Josué", apellidos: "Rodríguez" },
          { id: 7, nombres: "prueba", apellidos: "prueba" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
  }, []);

  const processSubmit = (data) => {
    console.log("Datos originales del formulario:", data);
    
    if (!data.id_cliente) {
      toast.error('El cliente es requerido');
      return;
    }
    
    if (!data.id_equipo) {
      toast.error('El equipo es requerido');
      return;
    }
    
    if (!data.nombre || data.nombre.trim() === '') {
      toast.error('El nombre es requerido');
      return;
    }
    
    if (!data.fecha_entrega) {
      toast.error('La fecha de entrega es requerida');
      return;
    }
    
    const formattedData = {
      id_cliente: Number(data.id_cliente),
      id_equipo: Number(data.id_equipo),
      fecha_entrega: data.fecha_entrega,
      nombre: data.nombre,
      estado: "Activo"  
    };
    
    console.log("Datos formateados enviados:", formattedData);
    
    try {
      onSubmit(formattedData);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      toast.error('Error al crear el proyecto. Verifica tu conexión.');
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          {...register('id_cliente', { required: 'El cliente es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting || loading}
        >
          <option value="">Selecciona un cliente</option>
          {loading ? (
            <option value="" disabled>Cargando clientes...</option>
          ) : error ? (
            <option value="" disabled>Error: {error}</option>
          ) : clientes.length > 0 ? (
            clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombres} {cliente.apellidos}
              </option>
            ))
          ) : (
            <option value="" disabled>No hay clientes disponibles</option>
          )}
        </select>
        {errors.id_cliente && <p className="text-red-500 text-xs mt-1">{errors.id_cliente.message}</p>}
      </div>
     
      <div>
        <label className="block text-sm font-medium text-gray-700">Equipo</label>
        <select
          {...register('id_equipo', { required: 'El equipo es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting}
        >
          <option value="">Selecciona un equipo</option>
          {equipos && equipos.length > 0 ? (
            equipos.map(equipo => (
              <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
            ))
          ) : (
            <option value="" disabled>No hay equipos disponibles</option>
          )}
        </select>
        {errors.id_equipo && <p className="text-red-500 text-xs mt-1">{errors.id_equipo.message}</p>}
      </div>
     
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
        <input
          type="text"
          {...register('nombre', { required: 'El nombre es requerido' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting}
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
      </div>
     
      <div>
        <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
        <input
          type="date"
          {...register('fecha_entrega', { required: 'La fecha de entrega es requerida' })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white"
          disabled={isSubmitting}
        />
        {errors.fecha_entrega && <p className="text-red-500 text-xs mt-1">{errors.fecha_entrega.message}</p>}
      </div>
     
      <div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? 'Procesando...' 
            : initialData && initialData.id 
              ? 'Actualizar Proyecto' 
              : 'Crear Proyecto'
          }
        </button>
      </div>
    </form>
  );
}