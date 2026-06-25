// =========================================================================
// ARCHIVO DE ESTILOS: LoginPage.styles.js
// =========================================================================
// Restaurado el estilo original oscuro y con efecto glassmorphism del prototipo.
// Los estilos se mantienen en este archivo separado para modularidad.

export const styles = {
  // Contenedor general que centra la tarjeta de login
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    width: '100%',
    px: 2,
  },

  // Tarjeta central (Paper) con estilo oscuro y glassmorphism
  loginCard: {
    maxWidth: 420,
    width: '100%',
    p: 4,
    borderRadius: 4,
    background: 'rgba(22, 28, 45, 0.6)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },

  // Contenedor de cabecera (Avatar e inicios)
  headerWrapper: {
    textAlign: 'center',
    mb: 3,
  },

  // Avatar circular de acceso con color índigo y sombra
  loginAvatar: {
    bgcolor: 'primary.main', // Hereda el color del tema global (#6366f1)
    width: 56,
    height: 56,
    mx: 'auto',
    mb: 2,
    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
  },

  // Título principal en blanco/claro
  titleText: {
    fontWeight: '700',
    color: 'text.primary',
  },

  // Subtítulo secundario
  subtitleText: {
    mt: 0.5,
    color: 'text.secondary',
  },

  // Mensaje de alerta (Errores)
  alertBox: {
    mb: 3,
    borderRadius: 2,
  },

  // Formulario y campos de texto
  inputField: {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  },

  // Botón de inicio de sesión con degradado azul/índigo
  submitButton: {
    mt: 3,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 'bold',
    textTransform: 'none',
    background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5254d8 0%, #256feb 100%)',
    },
  },

  // Texto con la información demo / sugerencias
  demoText: {
    textAlign: 'center',
    mt: 3,
  },
};
