'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { createProyecto } from '../../../services/proyectos';
import { getEquipos } from '../../../services/equipos';
import ProyectoForm from '../../../components/proyectos/ProyectoForm';
import toast from 'react-hot-toast';

export default function CrearProyectoPage() {
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const loadEquipos = async () => {
      try {
        const data = await getEquipos();
        setEquipos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
        toast.error('Error al cargar equipos');
      }
    };

    if (user) {
      loadEquipos();
    }
  }, [user, loading, router]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createProyecto(data);
      toast.success('Proyecto creado con éxito');
      router.push('/proyectos');
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      toast.error('Error al crear proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Proyecto</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ProyectoForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          equipos={equipos}
        />
      </div>
    </div>
  );
}