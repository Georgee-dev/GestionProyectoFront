'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import TareaCard from '../../../../components/tareas/TareaCard';

export default function TareasProyectoPage() {
  const { user, loading } = useAuth();
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Obtener ID del proyecto de la URL
  const [idProyecto, setIdProyecto] = useState(null);
  
  useEffect(() => {
    // Extraer el ID de la URL
    const path = window.location.pathname;
    const match = path.match(/\/tareas\/proyecto\/(\d+)/);
    if (match && match[1]) {
      setIdProyecto(match[1]);
    }
  }, []);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (!idProyecto) return;
    
    const loadTareas = async () => {
      setIsLoading(true);
      try {
        
        const data = [
          { id: 1, id_proyecto: idProyecto, tarea: "Diseñar pantallas de login", estado: "Pendiente" },
          { id: 2, id_proyecto: idProyecto, tarea: "Implementar autenticación", estado: "En Progreso" }
        ];
        
        setTareas(data);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
        toast.error('Error al cargar las tareas del proyecto');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTareas();
  }, [idProyecto, user, loading, router]);
  
  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tareas del Proyecto {idProyecto}</h1>
      
      <Link href="/proyectos" className="text-blue-600 hover:underline mb-6 block">
        ← Volver a proyectos
      </Link>
      
      {tareas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {tareas.map(tarea => (
            <TareaCard key={tarea.id} tarea={tarea} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-700">No hay tareas disponibles para este proyecto</p>
        </div>
      )}
    </div>
  );
}