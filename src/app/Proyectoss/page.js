'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { getProyectos, deleteProyecto } from '../../services/proyectos';
import ProyectoCard from '../../components/proyectos/ProyectoCard';
import Link from 'next/link';
import toast from 'react-hot-toast';



export default function ProyectosPage() {
  const { user, loading } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const loadProyectos = async () => {
      setIsLoading(true);
      try {
        const data = await getProyectos();
        setProyectos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        toast.error('Error al cargar proyectos');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProyectos();
    }
  }, [user, loading, router]);

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await deleteProyecto(id);
        toast.success('Proyecto eliminado con éxito');
        // Actualizar lista
        setProyectos(proyectos.filter(p => p.id !== id));
      } catch (error) {
        toast.error('Error al eliminar el proyecto');
      }
    }
  };

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
        <Link 
          href="/proyectos/crear" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Proyecto
        </Link>
      </div>

      {proyectos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectos.map((proyecto) => (
            <ProyectoCard 
              key={proyecto.id} 
              proyecto={proyecto} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-700">No hay proyectos disponibles</p>
        </div>
      )}
    </div>
  );
}