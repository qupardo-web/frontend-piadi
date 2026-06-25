import { useState } from 'react';
import { useAuthContext } from '../../../context/AuthContext';
import { loginRequest } from '../services/authService';

export const useAuth = () => {
  const { login, logout, user, isAuthenticated, loading: contextLoading } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginRequest(username, password);
      login(data.user, data.token);
      return true;
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    loading: loading || contextLoading,
    error,
    login: handleLogin,
    logout
  };
};
