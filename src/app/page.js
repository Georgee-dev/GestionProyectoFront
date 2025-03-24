// src/app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigimos al dashboard
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Si está cargando, muestra un spinner o mensaje
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  // Solo muestra la página de inicio si no hay usuario
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Sistema de Gestión de Proyectos
        </h1>
        
        <div className="max-w-xl text-center mb-10">
          <p className="text-lg mb-4">
            Bienvenido a nuestro sistema de gestión de proyectos. Una herramienta completa para administrar proyectos, equipos y tareas.
          </p>
          <p className="text-gray-600">
            Por favor, inicia sesión para acceder a todas las funcionalidades.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // Si hay usuario y no está redirigiendo, mostrar algo
  return <div>Redirigiendo...</div>;
}
