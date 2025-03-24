'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTareasMiembro } from '../../services/tareas';
import TareaCard from '../../components/tareas/TareaCard';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function TareasPage() {
  const { user, loading } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const loadTareas = async () => {
      setIsLoading(true);
      try {
        // Asumiendo que user.id contiene el ID del miembro
        // Nota: Si la API no tiene este endpoint, puedes simular algunas tareas
        const data = await getTareasMiembro(user.id);
        setTareas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
        toast.error('Error al cargar tareas');
        
        // Para demostración, si no existe el endpoint, podemos mostrar tareas ficticias
        setTareas([
          {
            id: 1,
            nombre: 'Implementar login',
            nombre_proyecto: 'Proyecto Web',
            descripcion: 'Crear formulario de login y conectarlo con la API',
            fecha_limite: '2025-03-25',
            estado: 'Pendiente'
          },
          {
            id: 2,
            nombre: 'Diseñar página principal',
            nombre_proyecto: 'Proyecto Web',
            descripcion: 'Crear mockups y diseño responsive',
            fecha_limite: '2025-03-30',
            estado: 'Pendiente'
          }
        ]);
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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mis Tareas</h1>

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