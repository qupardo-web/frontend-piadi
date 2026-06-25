import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    const savedUser = sessionStorage.getItem('auth_user');
    const token = sessionStorage.getItem('auth_token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        sessionStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem('auth_user', JSON.stringify(userData));
    sessionStorage.setItem('auth_token', token);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
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
