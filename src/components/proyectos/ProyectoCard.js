import Link from 'next/link';

export default function ProyectoCard({ proyecto, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{proyecto.nombre}</h3>
      <div className="text-sm text-gray-600 mb-4">
        <p>Cliente ID: {proyecto.id_cliente}</p>
        <p>Equipo ID: {proyecto.id_equipo}</p>
        <p>Fecha de entrega: {proyecto.fecha_entrega}</p>
        <p>Estado: <span className={`font-medium ${proyecto.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>{proyecto.estado}</span></p>
      </div>
      <div className="flex space-x-3">
        <Link href={`/proyectos/${proyecto.id}`} className="text-blue-600 hover:underline">
          Ver detalles
        </Link>
        <button onClick={() => onDelete(proyecto.id)} className="text-red-600 hover:underline">
          Eliminar
        </button>
      </div>
    </div>
  );
}