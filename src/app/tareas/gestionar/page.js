
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TareaForm from '../../../components/tareas/TareaForm';
import AsignarResponsableForm from '../../../components/tareas/AsignarResponsableForm';
import toast from 'react-hot-toast';

export default function GestionarTareasPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('crear');
  const [selectedTareaId, setSelectedTareaId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  
  const handleTareaCreada = (data) => {
    console.log('Tarea creada con ID:', data.id_tarea);
    if (data && data.id_tarea) {
      setSelectedTareaId(data.id_tarea);
      setActiveTab('asignar');
      toast.success('Tarea creada. Ahora puedes asignar un responsable.');
    }
  };

  
  const handleResponsableAsignado = () => {
    toast.success('Responsable asignado correctamente');
    setSelectedTareaId('');
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Tareas</h1>
      
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('crear')}
          className={`px-4 py-2 ${activeTab === 'crear' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-l-md`}
        >
          Crear Tarea
        </button>
        <button
          onClick={() => setActiveTab('asignar')}
          className={`px-4 py-2 ${activeTab === 'asignar' ? 'bg-blue-600 text-white' : 'bg-gray-200'} rounded-r-md`}
        >
          Asignar Responsable
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === 'crear' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Tarea</h2>
            <TareaForm onSuccess={handleTareaCreada} />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Asignar Responsable</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">ID de la Tarea</label>
              <input
                type="text"
                value={selectedTareaId}
                onChange={(e) => setSelectedTareaId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Ingrese el ID de la tarea"
              />
            </div>
            {selectedTareaId && (
              <AsignarResponsableForm
                tareaId={selectedTareaId}
                onSuccess={handleResponsableAsignado}
              />
            )}
          </>
        )}
      </div>
      
      <div className="mt-6 text-center">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}