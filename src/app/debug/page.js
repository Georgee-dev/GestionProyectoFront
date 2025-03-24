// pages/debug.js
'use client';

import { useState } from 'react';
import api from '@/services/api';

export default function DebugPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prueba una ruta simple
      const response = await api.post('/?url=Login/login', {
        email: 'josue@gmail.com',
        contra: 'password'
      });
      setResult(response.data);
    } catch (err) {
      setError({
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Debug Tool</h1>
      
      <button 
        onClick={testConnection}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          <h2 className="font-bold">Error:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
          <h2 className="font-bold">Success:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}