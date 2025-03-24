'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { getProyecto, updateProyecto, deleteProyecto } from '../../../services/proyectos';
import { getEquipos } from '../../../services/equipos';
import toast from 'react-hot-toast';
import ProyectoForm from '../../../components/proyectos/ProyectoForm';
import Link from 'next/link';

export default function DetalleProyectoPage({ params }) {
  const { user, loading } = useAuth();
  const [proyecto, setProyecto] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { id } = params; 

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [proyectoData, equiposData] = await Promise.all([
          getProyecto(id),
          getEquipos()
        ]);
        
        setProyecto(proyectoData);
        setEquipos(Array.isArray(equiposData) ? equiposData : []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos del proyecto');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && id) {
      loadData();
    }
  }, [id, user, loading, router]);

  const handleUpdate = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProyecto(id, data);
      toast.success('Proyecto actualizado con éxito');
      setIsEditing(false);
      
      
      const updatedProyecto = await getProyecto(id);
      setProyecto(updatedProyecto);
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      toast.error('Error al actualizar el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await deleteProyecto(id);
        toast.success('Proyecto eliminado con éxito');
        router.push('/proyectos');
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        toast.error('Error al eliminar el proyecto');
      }
    }
  };

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  if (!proyecto) {
    return (
      <div className="container mx-auto max-w-md mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <p className="mb-4">El proyecto solicitado no existe o no tienes acceso a él.</p>
          <Link href="/proyectos" className="text-blue-600 hover:underline">
            Volver a la lista de proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md">
      {isEditing ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Editar Proyecto</h1>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ProyectoForm 
              initialData={proyecto} 
              onSubmit={handleUpdate} 
              isSubmitting={isSubmitting} 
              equipos={equipos}
            />
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{proyecto.nombre}</h1>
          <div className="mb-6">
            <p className="text-gray-700"><span className="font-medium">Cliente ID:</span> {proyecto.id_cliente}</p>
            <p className="text-gray-700"><span className="font-medium">Equipo ID:</span> {proyecto.id_equipo}</p>
            <p className="text-gray-700"><span className="font-medium">Fecha de entrega:</span> {proyecto.fecha_entrega}</p>
            <p className="text-gray-700">
              <span className="font-medium">Estado:</span> 
              <span className={proyecto.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}>
                {proyecto.estado}
              </span>
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
            >
              Editar
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
            >
              Eliminar
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Link href="/proyectos" className="text-blue-600 hover:underline">
              Volver a proyectos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}