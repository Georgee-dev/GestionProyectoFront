'use client';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
 
  
  if (!user) return null;
 
  
  const isGerente = user.rol === 'Gerente' || user.rol === '';
  const isCliente = user.rol === 'Cliente';

  const isActive = (path) => {
    return pathname.startsWith(path) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200 text-gray-900";
  };

  return (
    <div className="w-64 bg-gray-100 min-h-screen p-5 overflow-y-auto">
      <h2 className="text-xl font-bold mb-5 text-gray-900">Menú</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            href="/dashboard" 
            className={`block p-2 rounded ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
        </li>
        
        {/* Menú para Gerente */}
        {isGerente && (
          <>
            <li className="pt-2 border-t">
              <span className="text-sm font-medium text-gray-700">GESTIÓN</span>
            </li>
            <li>
              <Link 
                href="/proyectos" 
                className={`block p-2 rounded ${isActive('/proyectos')}`}
              >
                Proyectos
              </Link>
            </li>
            <li>
              <Link 
                href="/equipos" 
                className={`block p-2 rounded ${isActive('/equipos')}`}
              >
                Equipos
              </Link>
            </li>
            <li>
              <Link 
                href="/tareas/gestionar" 
                className={`block p-2 rounded ${isActive('/tareas/gestionar')}`}
              >
                Gestionar Tareas
              </Link>
            </li>
          </>
        )}
     
        {/* Menú para Cliente */}
        {isCliente && (
          <>
            <li className="pt-2 border-t">
              <span className="text-sm font-medium text-gray-700">MIS DATOS</span>
            </li>
            <li>
              <Link 
                href="/tareas/asignadas" 
                className={`block p-2 rounded ${isActive('/tareas/asignadas')}`}
              >
                Mis Tareas
              </Link>
            </li>
            <li>
              <Link 
                href="/proyectos/asignados" 
                className={`block p-2 rounded ${isActive('/proyectos/asignados')}`}
              >
                Mis Proyectos
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}