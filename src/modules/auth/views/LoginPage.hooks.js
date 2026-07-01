import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const useLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para validación de campos vacíos y formato de correo
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reiniciar validaciones previas
    setEmailError(false);
    setEmailHelperText('');
    setPasswordError(false);
    
    let hasError = false;
    
    // Validar si el campo de correo está vacío
    if (!email.trim()) {
      setEmailError(true);
      setEmailHelperText('Por favor ingrese su correo electrónico');
      hasError = true;
    } else {
      // Validar formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError(true);
        setEmailHelperText('Por favor ingrese un formato de correo electrónico válido');
        hasError = true;
      }
    }
    
    if (!password.trim()) {
      setPasswordError(true);
      hasError = true;
    }
    
    if (hasError) return; // Evita el envío si hay algún error
    
    await login(email, password);
  };

  const handleOAuthLogin = () => {
    alert('Redirigiendo a autenticación SSO institucional...');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    emailError,
    setEmailError,
    emailHelperText,
    setEmailHelperText,
    passwordError,
    setPasswordError,
    login,
    error,
    loading,
    handleSubmit,
    handleOAuthLogin
  };
};
