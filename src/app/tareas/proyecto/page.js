'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getProyecto } from '@/services/proyectos';
import { getTareasAsignadas } from '@/services/tareas';
import TareaCard from '@/components/tareas/TareaCard';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function TareasProyectoPage({ params }) {
  const { user, loading } = useAuth();
  const [proyecto, setProyecto] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        // Cargar información del proyecto
        const proyectoData = await getProyecto(id);
        setProyecto(proyectoData);

        // Cargar tareas del usuario
        const tareasResponse = await getTareasAsignadas();
        if (tareasResponse.success) {
          // Filtrar las tareas que pertenecen a este proyecto
          const tareasProyecto = tareasResponse.tareas.filter(
            tarea => tarea.id_proyecto == id
          );
          setTareas(tareasProyecto);
        } else {
          throw new Error(tareasResponse.message || 'Error al cargar tareas');
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && id) {
      loadData();
    }
  }, [id, user, loading, router]);

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  if (!proyecto) {
    return (
      <div className="container mx-auto max-w-md mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <p className="mb-4">El proyecto solicitado no existe o no tienes acceso a él.</p>
          <Link href="/proyectos/asignados" className="text-blue-600 hover:underline">
            Volver a mis proyectos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/proyectos/asignados" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Volver a mis proyectos
        </Link>
        <h1 className="text-2xl font-bold">Tareas del Proyecto: {proyecto.nombre}</h1>
        <p className="text-gray-600">Fecha de entrega: {proyecto.fecha_entrega}</p>
      </div>

      {tareas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tareas.map((tarea) => (
            <TareaCard key={tarea.id} tarea={tarea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay tareas asignadas para este proyecto</p>
        </div>
      )}
    </div>
  );
}