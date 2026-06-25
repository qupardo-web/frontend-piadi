import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { styles } from './LoginPage.styles';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Alert, 
  Avatar 
} from '@mui/material';
import { 
  Lock as LockIcon, 
  Person as PersonIcon, 
  Visibility, 
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    await login(username, password);
  };

  return (
    <Box sx={styles.pageWrapper}>
      <Paper elevation={4} sx={styles.loginCard}>
        
        {/* Cabecera y Título */}
        <Box sx={styles.headerWrapper}>
          <Avatar sx={styles.loginAvatar}>
            <LoginIcon />
          </Avatar>
          <Typography variant="h5" component="h2" sx={styles.titleText}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" sx={styles.subtitleText}>
            Ingresa tus credenciales para continuar
          </Typography>
        </Box>

        {/* Alerta de Error */}
        {error && (
          <Alert severity="error" sx={styles.alertBox}>
            {error}
          </Alert>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
            sx={styles.inputField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            sx={styles.inputField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={styles.submitButton}
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </Button>
        </form>

        {/* Credenciales Demo */}
        <Box sx={styles.demoText}>
          <Typography variant="caption" color="text.secondary">
            Demo: <strong>admin</strong> / <strong>admin123</strong>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
