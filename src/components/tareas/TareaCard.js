'use client';

import { useState } from 'react';
import { registrarProgresoTarea, getProgresoTarea } from '@/services/tareas';
import toast from 'react-hot-toast';

export default function TareaCard({ tarea }) {
  const [showForm, setShowForm] = useState(false);
  const [comentario, setComentario] = useState('');
  const [newEstado, setNewEstado] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progresos, setProgresos] = useState(null);
  const [showProgresos, setShowProgresos] = useState(false);

  const estadoClass = {
    'Pendiente': 'text-yellow-600 bg-yellow-100',
    'En Progreso': 'text-blue-600 bg-blue-100',
    'Finalizada': 'text-green-600 bg-green-100'
  }[tarea.estado] || 'text-gray-600 bg-gray-100';

  const handleRegistrarProgreso = async (e) => {
    e.preventDefault();
    if (!comentario || !newEstado) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        id_tarea: tarea.id,
        comentario,
        last_estado: tarea.estado,
        new_estado: newEstado
      };
      
      const response = await registrarProgresoTarea(data);
      if (response.success) {
        toast.success('Progreso registrado con éxito');
        setShowForm(false);
        setComentario('');
        setNewEstado('');
        
        window.location.reload(); 
      } else {
        toast.error(response.message || 'Error al registrar progreso');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al registrar progreso');
    } finally {
      setIsLoading(false);
    }
  };

  const verProgresos = async () => {
    if (showProgresos && progresos) {
      setShowProgresos(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await getProgresoTarea(tarea.id);
      if (response.success) {
        setProgresos(response.progreso || []);
        setShowProgresos(true);
      } else {
        toast.error(response.message || 'Error al obtener progresos');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al obtener progresos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{tarea.tarea}</h3>
      <div className="text-sm text-gray-600 mb-4">
        <p>Proyecto ID: {tarea.id_proyecto}</p>
        <p>Estado: 
          <span className={`font-medium ml-1 px-2 py-1 rounded-full text-xs ${estadoClass}`}>
            {tarea.estado}
          </span>
        </p>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Actualizar Progreso'}
        </button>
        <button 
          onClick={verProgresos}
          className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          {showProgresos ? 'Ocultar Progresos' : 'Ver Progresos'}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleRegistrarProgreso} className="border-t pt-4 mb-4">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comentario</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Añade un comentario sobre el progreso"
              rows="3"
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
            <select
              value={newEstado}
              onChange={(e) => setNewEstado(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecciona un estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Finalizada">Finalizada</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {isLoading ? 'Guardando...' : 'Guardar Progreso'}
          </button>
        </form>
      )}
      
      {showProgresos && progresos && (
        <div className="border-t pt-4">
          <h4 className="text-lg font-medium mb-2">Historial de Progresos</h4>
          {progresos.length === 0 ? (
            <p className="text-gray-500">No hay registros de progreso</p>
          ) : (
            <ul className="space-y-3">
              {progresos.map((progreso, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="text-sm text-gray-700">{progreso.comentario}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>De: {progreso.last_estado} → A: {progreso.new_estado}</span>
                    <span>{progreso.fecha ? new Date(progreso.fecha).toLocaleDateString() : 'Fecha no disponible'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}