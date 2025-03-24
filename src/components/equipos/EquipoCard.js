import Link from 'next/link';

export default function EquipoCard({ equipo, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{equipo.nombre}</h3>
      <div className="text-sm text-gray-600 mb-4">
        <p>Responsable ID: {equipo.id_responsable}</p>
        <p>Estado: <span className={`font-medium ${equipo.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>{equipo.estado}</span></p>
      </div>
      <div className="flex space-x-3">
        <Link href={`/equipos/${equipo.id}`} className="text-blue-600 hover:underline">
          Ver detalles
        </Link>
        <button onClick={() => onDelete(equipo.id)} className="text-red-600 hover:underline">
          Eliminar
        </button>
      </div>
    </div>
  );
}