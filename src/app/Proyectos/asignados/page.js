'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getProyectosAsignados } from '../../../services/proyectos';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProyectosAsignadosPage() {
  const { user, loading } = useAuth();
  const [proyectos, setProyectos] = useState([]);
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

    const loadProyectos = async () => {
      setIsLoading(true);
      try {
        const response = await getProyectosAsignados();
        if (response.success) {
          setProyectos(response.proyectos || []);
        } else {
          toast.error(response.message || 'Error al cargar proyectos');
          setProyectos([]);
        }
      } catch (error) {
        console.error('Error al cargar proyectos asignados:', error);
        toast.error('Error al cargar proyectos asignados');
        setProyectos([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProyectos();
    }
  }, [user, loading, router]);

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Mis Proyectos Asignados</h1>
      
      {proyectos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <div key={proyecto.id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{proyecto.nombre}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <p>Cliente ID: {proyecto.id_cliente}</p>
                <p>Equipo ID: {proyecto.id_equipo}</p>
                <p>Fecha de entrega: {proyecto.fecha_entrega}</p>
                <p>Estado: <span className={`font-medium ${proyecto.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>{proyecto.estado}</span></p>
              </div>
              <div className="mt-4">
                <Link 
                  href={`/tareas/proyecto/${proyecto.id}`} 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ver Tareas
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No tienes proyectos asignados.</p>
      )}
    </div>
  );
}