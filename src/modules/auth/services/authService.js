const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Sends credentials to the backend for verification.
 * For demonstration and local development, we fallback to a safe mock verification
 * if the backend api/auth/login endpoint is not fully implemented or offline.
 */
export const loginRequest = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (response.ok) {
      if (isJson) {
        return await response.json();
      }
      throw new Error('El servidor no respondió con el formato esperado.');
    }
    
    const errMessage = isJson 
      ? (await response.json()).error 
      : `Error del servidor (${response.status})`;
      
    throw new Error(errMessage || 'Credenciales inválidas');
  } catch (err) {
    // If backend endpoint does not exist yet (404/network error), allow mock login for demonstration
    if (err.message.includes('Failed to fetch') || err.message.includes('404')) {
      console.warn('Backend Auth endpoint offline/missing. Falling back to mock authentication.');
      
      // Simple secure fallback logic (do not use in production)
      if (username === 'admin' && password === 'admin123') {
        return {
          user: { id: 1, username: 'admin', role: 'Administrador' },
          token: 'mock-session-jwt-token-123456'
        };
      }
      throw new Error('Usuario o contraseña incorrectos (Prueba con admin / admin123)');
    }
    throw err;
  }
};
