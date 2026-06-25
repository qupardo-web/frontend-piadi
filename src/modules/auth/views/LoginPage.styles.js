// =========================================================================
// ARCHIVO DE ESTILOS: LoginPage.styles.js
// =========================================================================
// Diseñado siguiendo el mockup de referencia_login.png.
// Implementa un diseño de pantalla dividida (split-screen):
// - Izquierda: Banner institucional azul marino.
// - Derecha: Panel de inicio de sesión blanco y limpio.

export const styles = {
  // Contenedor principal de pantalla completa
  pageWrapper: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    bgcolor: '#ffffff',
    fontFamily: "'Inter', sans-serif",
  },

  // Panel izquierdo: Banner institucional (solo visible en escritorios)
  leftPane: {
    display: { xs: 'none', md: 'flex' },
    width: '60%',
    bgcolor: '#1E2875', // Azul institucional
    color: '#ffffff',
    flexDirection: 'column',
    justifyContent: 'center',
    pl: 10,
    pr: 6,
  },

  leftTitleText1: {
    fontSize: '44px',
    fontWeight: 500,
    lineHeight: 1.3,
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
  },

  leftTitleText2: {
    fontSize: '44px',
    fontWeight: 700,
    lineHeight: 1.3,
    color: '#ffffff',
    fontFamily: "'Inter', sans-serif",
  },

  // Panel derecho: Formulario de inicio de sesión
  rightPane: {
    width: { xs: '100%', md: '40%' },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    bgcolor: '#ffffff',
    px: { xs: 4, sm: 8, md: 8 },
    py: 6,
    height: '100vh',
    overflowY: 'auto',
  },

  // Cabecera con el logo circular y el texto PIADI ECAS
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mb: 6,
    mt: { xs: 5, md: 0 }, // Añade espacio superior en dispositivos móviles para evitar cortes en resoluciones pequeñas
  },

  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    bgcolor: '#1E2875',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
    boxShadow: '0 2px 6px rgba(30, 40, 117, 0.15)',
  },

  logoText: {
    fontWeight: 500, // Removido el bold (cambiado de 700 a 500)
    fontSize: '24px',
    color: '#1F2937',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: -0.5,
  },

  // Título "Iniciar sesión"
  loginHeader: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#1F2937',
    mb: 4,
    fontFamily: "'Inter', sans-serif",
  },

  // Botón "Ingresar con cuenta institucional"
  oauthButton: {
    width: '100%',
    py: 1.2,
    border: '1px solid #1E2875',
    borderRadius: 2,
    textTransform: 'none',
    color: '#1E2875',
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    bgcolor: '#ffffff',
    '&:hover': {
      bgcolor: 'rgba(30, 40, 117, 0.04)',
      borderColor: '#1E2875',
    },
  },

  // Separador de texto ("o")
  separatorContainer: {
    display: 'flex',
    alignItems: 'center',
    my: 3.5,
  },

  separatorLine: {
    flexGrow: 1,
    height: '1px',
    bgcolor: '#E5E7EB',
  },

  separatorText: {
    color: '#94A3B8',
    mx: 2,
    fontSize: '14px',
    fontWeight: 500,
  },

  // Etiquetas de los campos de texto
  fieldLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
    mb: 0.8,
  },

  // Campos de entrada (inputs)
  inputField: {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      bgcolor: '#ffffff',
      height: '46px',
      color: '#1F2937',
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#CBD5E1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1E2875',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#1F2937',
      '&::placeholder': {
        color: '#94A3B8',
        opacity: 1,
      },
    },
  },

  // Fila de opciones: Checkbox + Link
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 4,
    width: '100%',
  },

  checkboxLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#475569',
    cursor: 'pointer',
  },

  forgotPasswordLink: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#0F4AFF',
    textDecoration: 'underline',
  },

  // Botón solidario para iniciar sesión
  submitButton: {
    width: '100%',
    py: 1.4,
    borderRadius: 2,
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
    bgcolor: '#1E2875',
    color: '#ffffff',
    boxShadow: 'none',
    '&:hover': {
      bgcolor: '#12184d',
      boxShadow: 'none',
    },
    '&.Mui-disabled': {
      bgcolor: '#E2E8F0',
      color: '#94A3B8',
    },
  },

  // Alerta de error
  alertBox: {
    mb: 3,
    borderRadius: 2,
  },

  // Credenciales demo
  demoContainer: {
    textAlign: 'center',
    mt: 3,
  },
};
