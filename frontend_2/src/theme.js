import { createTheme } from '@mui/material/styles';

const DISPLAY_FONT = '"Audiowide", "Inter", sans-serif';
const BODY_FONT = '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF4136',
      light: '#FF6F61',
      dark: '#CC332A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D4FF',
      light: '#33E0FF',
      dark: '#00A6CC',
      contrastText: '#000000',
    },
    background: {
      default: '#0A0A0A',
      paper: '#1F1F1F',
    },
    text: {
      primary: '#E8E8E8',
      secondary: '#A0A0A0',
      disabled: '#616161',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
    action: {
      active: '#E0E0E0',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.15)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.05)',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    // Audiowide is the brand/display font; body text uses Inter for readability.
    fontFamily: BODY_FONT,
    root: {
      fontFamily: DISPLAY_FONT,
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h1: { fontFamily: DISPLAY_FONT, fontSize: '4rem', fontWeight: 400, letterSpacing: '-0.01em', color: '#FFFFFF' },
    h2: { fontFamily: DISPLAY_FONT, fontSize: '3rem', fontWeight: 400, color: '#FFFFFF' },
    h3: { fontFamily: DISPLAY_FONT, fontSize: '2.4rem', fontWeight: 400, color: '#FFFFFF' },
    h4: { fontFamily: DISPLAY_FONT, fontSize: '2rem', fontWeight: 400, color: '#FFFFFF' },
    h5: { fontFamily: DISPLAY_FONT, fontSize: '1.35rem', fontWeight: 400, color: '#FFFFFF' },
    h6: { fontSize: '1.15rem', fontWeight: 600, color: '#E8E8E8' },
    body1: { fontSize: '1rem', lineHeight: 1.6, color: '#E8E8E8' },
    body2: { fontSize: '0.9rem', color: '#A0A0A0' },
    caption: { fontSize: '0.8rem', color: '#8A8A8A' },
    subtitle1: { fontSize: '1rem', fontWeight: 500, color: '#E8E8E8' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000',
          backgroundImage:
            'radial-gradient(circle at top left, rgba(0, 255, 255, 0.22), transparent 40%), radial-gradient(circle at bottom right, rgba(255, 69, 0, 0.22), transparent 40%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0, 212, 255, 0.25)', borderRadius: 8 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease-out, background-color 0.2s ease-out',
          '&:active': { transform: 'translateY(1px)' },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)',
          '&:hover': { boxShadow: '0 6px 18px rgba(0, 0, 0, 0.5)' },
        },
        containedPrimary: {
          '&:hover': { backgroundColor: '#E6392D', boxShadow: '0 6px 20px rgba(255, 65, 54, 0.35)' },
        },
        containedSecondary: {
          color: '#0A0A0A',
          '&:hover': { backgroundColor: '#00BEE6' },
        },
        outlinedPrimary: {
          '&:hover': { backgroundColor: 'rgba(255, 65, 54, 0.08)' },
        },
        outlinedSecondary: {
          '&:hover': { backgroundColor: 'rgba(0, 212, 255, 0.08)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          minWidth: 200,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161616',
          borderRadius: 16,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#00D4FF',
          textDecoration: 'none',
          fontWeight: 600,
          '&:hover': { textDecoration: 'underline', color: '#33E0FF' },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          '&:not(.MuiBackdrop-invisible)': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 212, 255, 0.6)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00D4FF' },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#A0A0A0',
          '&.Mui-focused': { color: '#00D4FF' },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#333333',
          color: '#FFFFFF',
          fontSize: '0.8rem',
          borderRadius: 6,
          padding: '6px 10px',
        },
        arrow: { color: '#333333' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#E0E0E0',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
        },
      },
    },
  },
});

export default theme;
