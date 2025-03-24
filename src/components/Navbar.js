'use client';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      
      await logout();
      
      
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Gestión de Proyectos
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <span>Hola, {user.nombres || 'Usuario'}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}