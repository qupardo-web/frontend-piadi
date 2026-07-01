import React from 'react';
import { useLoginPage } from './LoginPage.hooks';
import { styles } from './LoginPage.styles';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Alert 
} from '@mui/material';
import { 
  createTheme, 
  ThemeProvider 
} from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff
} from '@mui/icons-material';
import logoEcas from '../../../assets/logo_ECAS.svg';
import loginBg from '../../../assets/fondo_login_ECAS.png';

// Creamos un tema claro local para asegurar que los inputs y textos del panel
// de login se muestren correctamente (texto oscuro sobre fondo blanco).
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    text: {
      primary: '#1F2937',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});

export const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    emailError,
    emailHelperText,
    passwordError,
    error,
    loading,
    handleSubmit,
    handleOAuthLogin
  } = useLoginPage();

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={styles.pageWrapper}>
        
        {/* PANEL IZQUIERDO: Banner institucional */}
        <Box sx={{
          ...styles.leftPane,
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          <Typography sx={styles.leftTitleText1}>
            Plataforma Integrada para
          </Typography>
          <Typography sx={styles.leftTitleText2}>
            Análisis de Desempeño Institucional
          </Typography>
        </Box>

        {/* PANEL DERECHO: Formulario de Login */}
        <Box sx={styles.rightPane}>
          
          {/* Logo y Nombre del Sistema */}
          <Box sx={styles.logoRow}>
            <Box 
              component="img" 
              src={logoEcas} 
              alt="Logo ECAS" 
              sx={{ width: 36, height: 36, objectFit: 'contain' }} 
            />
            <Typography sx={styles.logoText}>PIADI ECAS</Typography>
          </Box>

          {/* Encabezado */}
          <Typography sx={styles.loginHeader}>
            Iniciar sesión
          </Typography>

          {/* Botón: Cuenta Institucional */}
          <Button 
            variant="outlined" 
            sx={styles.oauthButton}
            onClick={handleOAuthLogin}
          >
            Ingresar con cuenta institucional
          </Button>

          {/* Separador "o" */}
          <Box sx={styles.separatorContainer}>
            <Box sx={styles.separatorLine} />
            <Typography sx={styles.separatorText}>o</Typography>
            <Box sx={styles.separatorLine} />
          </Box>

          {/* Alerta de Error */}
          {error && (
            <Alert severity="error" sx={styles.alertBox}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            
            {/* Campo: Correo electrónico */}
            <Typography sx={styles.fieldLabel}>Correo electrónico</Typography>
            <TextField
              fullWidth
              placeholder="Ingrese su correo electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              error={emailError}
              helperText={emailHelperText}
              sx={styles.inputField}
            />

            {/* Campo: Contraseña */}
            <Typography sx={styles.fieldLabel}>Contraseña</Typography>
            <TextField
              fullWidth
              placeholder="Ingrese su contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              error={passwordError}
              helperText={passwordError ? "Por favor ingrese su contraseña" : ""}
              sx={styles.inputField}
              InputProps={{
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

            {/* Fila de opciones: Checkbox + Link */}
            <Box sx={styles.optionsRow}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="remember-checkbox" 
                  style={{ marginRight: '8px', cursor: 'pointer' }} 
                />
                <Typography 
                  component="label" 
                  htmlFor="remember-checkbox" 
                  sx={styles.checkboxLabel}
                >
                  Recordar sesión?
                </Typography>
              </Box>
              <Typography 
                component="a" 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert('Funcionalidad de recuperación de contraseña.'); }}
                sx={styles.forgotPasswordLink}
              >
                Olvide mi contraseña
              </Typography>
            </Box>

            {/* Botón de Entrada */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={styles.submitButton}
            >
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </Button>
          </form>

        </Box>
      </Box>
    </ThemeProvider>
  );
};
