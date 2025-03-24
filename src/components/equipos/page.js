'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { getEquipos, deleteEquipo } from '../../services/equipos';
import EquipoCard from '../../components/equipos/EquipoCard';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function EquiposPage() {
  const { user, loading } = useAuth();
  const [equipos, setEquipos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const loadEquipos = async () => {
      setIsLoading(true);
      try {
        const data = await getEquipos();
        setEquipos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
        toast.error('Error al cargar equipos');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadEquipos();
    }
  }, [user, loading, router]);

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este equipo?')) {
      try {
        await deleteEquipo(id);
        toast.success('Equipo eliminado con éxito');
        // Actualizar lista
        setEquipos(equipos.filter(e => e.id !== id));
      } catch (error) {
        toast.error('Error al eliminar el equipo');
      }
    }
  };

  if (loading || isLoading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipos</h1>
        <Link 
          href="/equipos/crear" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Equipo
        </Link>
      </div>

      {equipos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((equipo) => (
            <EquipoCard 
              key={equipo.id} 
              equipo={equipo} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay equipos disponibles</p>
        </div>
      )}
    </div>
  );
}