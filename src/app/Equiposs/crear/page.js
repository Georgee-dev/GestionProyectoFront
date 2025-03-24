'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { createEquipo } from '../../../services/equipos';
import EquipoForm from '../../../components/equipos/EquipoForm';
import toast from 'react-hot-toast';

export default function CrearEquipoPage() {
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createEquipo(data);
      toast.success('Equipo creado con éxito');
      router.push('/equipos');
    } catch (error) {
      console.error('Error al crear equipo:', error);
      toast.error('Error al crear el equipo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Equipo</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <EquipoForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}