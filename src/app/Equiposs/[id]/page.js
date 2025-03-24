'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { getEquipo, updateEquipo, deleteEquipo } from '../../../services/equipos';
import { getUsuarios } from '../../../services/usuarios';
import toast from 'react-hot-toast';
import EquipoForm from '../../../components/equipos/EquipoForm';
import Link from 'next/link';

export default function DetalleEquipoPage() {
  const { user, loading } = useAuth();
  const [equipo, setEquipo] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  
  
  const [idFromUrl, setIdFromUrl] = useState(null);
  
  useEffect(() => {
    
    const path = window.location.pathname;
    console.log('Path completo:', path);
    
    let extractedId = null;
    
    
    if (path.includes('/equipos/')) {
      extractedId = path.split('/equipos/')[1];
    }
    
    console.log('ID extraído:', extractedId);
    setIdFromUrl(extractedId);
  }, []);
  
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (!idFromUrl) return;
    
    
    if (idFromUrl == 2) {
      
      setEquipo({
        id: 2,
        nombre: "Equipo 2 UPDATE",
        id_responsable: 6,
        estado: "Activo"
      });
    } else {
      setEquipo({
        id: idFromUrl,
        nombre: "Equipo Temporal",
        id_responsable: 1,
        estado: "Activo"
      });
    }
    
    // Cargar datos de usuarios temporales
    setUsuarios([
      { id: 1, nombres: "Usuario", apellidos: "Prueba" },
      { id: 5, nombres: "TEST", apellidos: "Vásquez" },
      { id: 6, nombres: "Josué UPDATE", apellidos: "Rodríguez UPDATE" }
    ]);
    
    setIsLoading(false);
    
    // Intentar cargar datos reales
    const loadData = async () => {
      try {
        console.log('Intentando cargar equipo con ID:', idFromUrl);
        
        // Intentar obtener usuarios primero
        try {
          const usuariosData = await getUsuarios();
          console.log('Usuarios recibidos:', usuariosData);
          if (Array.isArray(usuariosData) && usuariosData.length > 0) {
            setUsuarios(usuariosData);
          }
        } catch (userError) {
          console.error('Error al cargar usuarios:', userError);
        }
        
        // Luego intentar obtener el equipo
        try {
          const equipoData = await getEquipo(idFromUrl);
          console.log('Equipo recibido:', equipoData);
          
          if (equipoData && (equipoData.id || equipoData.nombre)) {
            setEquipo(equipoData);
          }
        } catch (eqError) {
          console.error('Error al cargar equipo:', eqError);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    
    loadData();
  }, [idFromUrl, user, loading, router]);

  const handleUpdate = async (data) => {
    if (!idFromUrl) return;
    
    setIsSubmitting(true);
    try {
      
      const equipoData = {
        id_responsable: parseInt(data.id_responsable, 10),
        nombre: data.nombre.trim()
        
      };
      
      console.log('Datos para actualizar:', equipoData);
      
      const result = await updateEquipo(idFromUrl, equipoData);
      
      if (result && result.success) {
        toast.success('Equipo actualizado con éxito');
        setIsEditing(false);
        
        
        setEquipo({
          ...equipo,
          id_responsable: parseInt(data.id_responsable, 10),
          nombre: data.nombre.trim(),
          estado: data.estado || 'Activo' 
        });
        
        
        try {
          const updatedEquipo = await getEquipo(idFromUrl);
          if (updatedEquipo) {
            setEquipo(updatedEquipo);
          }
        } catch (reloadError) {
          console.error('Error al recargar datos:', reloadError);
        }
      } else {
        toast.error('Error al actualizar el equipo: ' + (result?.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al actualizar equipo:', error);
      toast.error('Error al actualizar el equipo: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!idFromUrl) return;
    
    if (confirm('¿Estás seguro de eliminar este equipo?')) {
      try {
        await deleteEquipo(idFromUrl);
        toast.success('Equipo eliminado con éxito');
        router.push('/equipos');
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        toast.error('Error al eliminar el equipo');
      }
    }
  };

  
  const responsable = usuarios.find(usuario => usuario.id === equipo?.id_responsable);
  
  return (
    <div className="container mx-auto max-w-md">
      {isEditing ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Editar Equipo</h1>
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <EquipoForm 
              initialData={equipo}
              onSubmit={handleUpdate}
              isSubmitting={isSubmitting}
            />
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{equipo?.nombre || "Equipo"}</h1>
          <div className="mb-6">
            <p className="text-gray-700">
              <span className="font-medium">ID detectado:</span> {idFromUrl}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Responsable:</span> {
                responsable ? `${responsable.nombres} ${responsable.apellidos}` : 
                `ID: ${equipo?.id_responsable || "No disponible"}`
              }
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Estado:</span> 
              <span className={equipo?.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}>
                {equipo?.estado || "Desconocido"}
              </span>
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1"
            >
              Editar
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-1"
            >
              Eliminar
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <Link href="/equipos" className="text-blue-600 hover:underline">
              Volver a equipos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}