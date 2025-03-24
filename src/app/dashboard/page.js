'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getProyectos } from '../../services/proyectos';
import { getEquipos } from '../../services/equipos';
import { getTareasAsignadas } from '../../services/tareas';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [proyectos, setProyectos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Cargar datos del dashboard
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Para gerentes
        if (user?.rol === 'Gerente' || user?.rol === '') {
          const [proyectosData, equiposData] = await Promise.all([
            getProyectos(),
            getEquipos()
          ]);
          
          setProyectos(proyectosData || []);
          setEquipos(equiposData || []);
        }
        
        // Para clientes
        if (user?.rol === 'Cliente') {
          const tareasData = await getTareasAsignadas();
          setTareas(tareasData.tareas || []);
        }
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        toast.error('Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, loading, router]);

  
  const navigateTo = useCallback((path) => {
    console.log(`Navegando a: ${path}`);
    router.push(path);
  }, [router]);

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  const isGerente = user?.rol === 'Gerente' || user?.rol === '';
  const isCliente = user?.rol === 'Cliente';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Dashboard</h1>
      
      {/* Contenido para Gerente */}
      {isGerente && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Resumen de Proyectos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Proyectos Recientes</h2>
              <button 
                onClick={() => navigateTo('/proyectos')}
                className="text-blue-600 hover:underline cursor-pointer"
                aria-label="Ver todos los proyectos"
              >
                Ver todos
              </button>
            </div>
            
            {proyectos.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {proyectos.slice(0, 5).map((proyecto) => (
                  <li key={proyecto.id} className="py-3">
                    <div 
                      onClick={() => navigateTo(`/proyectos/${proyecto.id}`)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      <span className="font-medium text-gray-900">{proyecto.nombre}</span>
                      <p className="text-sm text-gray-700">Estado: {proyecto.estado}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No hay proyectos disponibles</p>
            )}
          </div>
          
          {/* Resumen de Equipos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Equipos</h2>
              <button 
                onClick={() => navigateTo('/equipos')}
                className="text-blue-600 hover:underline cursor-pointer"
                aria-label="Ver todos los equipos"
              >
                Ver todos
              </button>
            </div>
            
            {equipos.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {equipos.slice(0, 5).map((equipo) => (
                  <li key={equipo.id} className="py-3">
                    <div 
                      onClick={() => navigateTo(`/equipos/${equipo.id}`)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      <span className="font-medium text-gray-900">{equipo.nombre}</span>
                      <p className="text-sm text-gray-700">Responsable ID: {equipo.id_responsable}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No hay equipos disponibles</p>
            )}
          </div>
          
          {/* Acciones rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => navigateTo('/proyectos/crear')}
                className="bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700"
              >
                Crear Proyecto
              </button>
              <button 
                onClick={() => navigateTo('/equipos/crear')}
                className="bg-green-600 text-white text-center py-3 px-4 rounded-md hover:bg-green-700"
              >
                Crear Equipo
              </button>
              <button 
                onClick={() => navigateTo('/tareas/gestionar')}
                className="bg-purple-600 text-white text-center py-3 px-4 rounded-md hover:bg-purple-700"
              >
                Crear Tarea
              </button>
             
            </div>
          </div>
        </div>
      )}
      
      {/* Contenido para Cliente */}
      {isCliente && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mis Tareas Pendientes */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mis Tareas Pendientes</h2>
              <button 
                onClick={() => navigateTo('/tareas/asignadas')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Ver todas
              </button>
            </div>
            
            {tareas.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {tareas.filter(t => t.estado !== 'Finalizada').slice(0, 5).map((tarea) => (
                  <li key={tarea.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <span className="font-medium text-gray-900">{tarea.tarea}</span>
                        <p className="text-sm text-gray-700">Proyecto ID: {tarea.id_proyecto}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        tarea.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {tarea.estado}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No tienes tareas pendientes</p>
            )}
          </div>
          
          {/* Acciones rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigateTo('/tareas/asignadas')}
                className="bg-blue-600 text-white text-center py-3 px-4 rounded-md hover:bg-blue-700"
              >
                Ver Mis Tareas
              </button>
              <button 
                onClick={() => navigateTo('/proyectos/asignados')}
                className="bg-green-600 text-white text-center py-3 px-4 rounded-md hover:bg-green-700"
              >
                Ver Mis Proyectos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}