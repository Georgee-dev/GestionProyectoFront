
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { login as loginService, logout as logoutService } from '@/services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
   
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('Usuario restaurado de localStorage:', parsedUser);
        }
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await loginService(credentials);
      
      if (result.success && result.user) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { 
          success: false, 
          message: result.message || 'Error de inicio de sesión' 
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
      router.push('/login');
      return { success: true };
    } catch (error) {
      console.error('Error en logout:', error);
      
      setUser(null);
      router.push('/login');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);