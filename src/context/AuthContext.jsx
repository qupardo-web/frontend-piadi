import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const clearStoredSession = () => {
  sessionStorage.removeItem('auth_user');
  sessionStorage.removeItem('auth_token');
};

const isTokenExpired = (token) => {
  if (!token || !token.includes('.')) {
    return true;
  }

  try {
    const decoded = jwtDecode(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTimeInSeconds;
  } catch (error) {
    return true;
  }
};

const getUserFromToken = (token) => {
  const decoded = jwtDecode(token);

  return {
    id: decoded.id,
    username: decoded.name || decoded.email,
    role: decoded.role
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al iniciar la app, se intenta restaurar la sesion guardada.
    // Si el JWT ya expiro o es invalido, se limpia la sesion local.
    const savedUser = sessionStorage.getItem('auth_user');
    const token = sessionStorage.getItem('auth_token');

    if (savedUser && token) {
      try {
        if (isTokenExpired(token)) {
          clearStoredSession();
          setUser(null);
        } else {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        clearStoredSession();
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    try {
      let userData;

      if (token && token.includes('.')) {
        if (isTokenExpired(token)) {
          clearStoredSession();
          setUser(null);
          return;
        }

        userData = getUserFromToken(token);
      } else {
        // Fallback de desarrollo local/offline.
        // No debe utilizarse como autenticacion real en produccion.
        userData = {
          id: 1,
          username: 'admin',
          role: 'Administrador'
        };
      }

      setUser(userData);
      sessionStorage.setItem('auth_user', JSON.stringify(userData));
      sessionStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error decodificando el token JWT:', error);
      clearStoredSession();
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
    clearStoredSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};