'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getTareasAsignadas } from '../../../services/tareas';
import TareaCard from '../../../components/tareas/TareaCard';
import toast from 'react-hot-toast';

export default function TareasAsignadasPage() {
  const { user, loading } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    
    if (!loading && user && user.rol !== 'Cliente') {
      router.push('/dashboard');
      toast.error('No tienes permisos para acceder a esta página');
      return;
    }

    const loadTareas = async () => {
      setIsLoading(true);
      try {
        const response = await getTareasAsignadas();
        if (response.success) {
          setTareas(response.tareas || []);
        } else {
          toast.error(response.message || 'Error al cargar tareas');
          setTareas([]);
        }
      } catch (error) {
        console.error('Error al cargar tareas asignadas:', error);
        toast.error('Error al cargar tareas asignadas');
        setTareas([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadTareas();
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Tareas Asignadas</h1>
      
      {tareas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tareas.map((tarea) => (
            <TareaCard key={tarea.id} tarea={tarea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No tienes tareas asignadas</p>
        </div>
      )}
    </div>
  );
}