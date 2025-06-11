import { createTheme } from '@mui/material/styles';

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
      primary: '#E0E0E0',
      secondary: '#A0A0A0',
      disabled: '#616161',
    },
    action: {
      active: '#E0E0E0',
      hover: 'rgba(255, 255, 255, 0.1)',
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
  typography: {
    fontFamily: '"Audiowide"',
    root: { 
      fontSize: '1.75rem',
      fontWeight: '900',
    },
    h1: {
      fontSize: '4.5rem',
      fontWeight: 900,
      letterSpacing: '-0.03em',
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 800,
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '2.8rem',
      fontWeight: 700,
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '2.2rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h5: {
      fontSize: '1.8rem',
      fontWeight: 600,
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#E0E0E0',
    },
    body1: {
      fontSize: '1.05rem',
      lineHeight: 1.6,
      color: '#E0E0E0',
    },
    body2: {
      fontSize: '0.9rem',
      color: '#A0A0A0',
    },
    caption: {
      fontSize: '0.78rem',
      color: '#808080',
    },
    subtitle1: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#E0E0E0',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          '& .MuiDrawer-paper': {
            backgroundColor: 'rgba(0, 0, 0, 0.7) !important',
            height: 'fit-content',
            margin: '25vh 0.3vw',
            backdropFilter: 'blur(10px)',
            border: '2px solid white',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '.css-rf1rdx': {
          backgroundColor: 'transparent !important',
          padding: '0 !important',
          margin: '0 !important',
          height: '100vh !important',
          width: '100vw !important',
        },
        '.css-1aoblgv': {
          backgroundColor: 'transparent !important',
          padding: '0 !important',
          margin: '0 !important',
        },
        '.css-145zdea' : {          
          backgroundColor: 'transparent !important',
          margin: '0 !important',
        },
        '.css-12bua5h-MuiDrawer-docked .MuiDrawer-paper': {
          height: 'fit-content',
          margin: '25vh 0.3vw',
          backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
          border: '2px solid white'
        },
        '.css-13x7i4e-MuiGrid-root': {
          '@media (max-width: 599px)': {
            margin: '0 !important'
          }
        },
        '[class*="MuiToolbar-root"]': {
          '@media (max-width: 599px)': {
            margin: '0 2vw !important',
            maxWidth: '95vw !important',
            display: 'flex !important',
            flexDirection: 'column !important',
            alignItems: 'center !important',
            gap: '8px !important',
            '& .MuiBox-root': {
              display: 'flex !important',
              flexDirection: 'row !important',
              alignItems: 'center !important',
              justifyContent: 'center !important',
              gap: '8px !important',
              width: '100% !important',
              '& .MuiTypography-root': {
                textAlign: 'center !important',
                marginRight: '0 !important',
                fontSize: '0.9rem !important',
                order: '1 !important'
              },
              '& .MuiButton-root': {
                marginLeft: '0 !important',
                padding: '6px 12px !important',
                minWidth: '120px !important',
                order: '2 !important'
              },
              '& .MuiAvatar-root': {
                marginLeft: '0 !important',
                marginRight: '0 !important',
                marginBottom: '4px !important'
              }
            }
          }
        },
        '[class*="MuiAppBar-root"]': {
          '@media (max-width: 599px)': {
            margin: '1vw 2vw !important',
            maxWidth: '95vw !important',
            display: 'flex !important',
            backdropFilter: 'blur(10px) !important',
            backgroundColor: 'rgba(0, 0, 0, 0.7) !important'
          }
        },
        '[class*="MuiIconButton-root"]': {
          '@media (max-width: 599px)': {
            position: 'fixed !important',
            left: '5vw !important',
            zIndex: '1200 !important'
          }
        },
        '.MuiBox-root.css-1obk09a': {
          '@media (max-width: 599px)': {
            display: 'none !important'
          }
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          padding: '10px 20px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, background-color 0.2s ease-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.5)',
          },
        },
        containedPrimary: {
          backgroundColor: '#FF4136',
          '&:hover': {
            backgroundColor: '#E6392D',
          },
        },
        containedSecondary: {
          backgroundColor: '#00D4FF',
          color: '#1A1A1A',
          '&:hover': {
            backgroundColor: '#00BEE6',
          },
        },
        outlinedPrimary: {
          borderColor: '#FF4136',
          color: '#FF4136',
          '&:hover': {
            backgroundColor: 'rgba(255, 65, 54, 0.08)',
            borderColor: '#E6392D',
          },
        },
        outlinedSecondary: {
          borderColor: '#00D4FF',
          color: '#00D4FF',
          '&:hover': {
            backgroundColor: 'rgba(0, 212, 255, 0.08)',
            borderColor: '#00BEE6',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.4)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.6)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          // padding: 0,
          // '&:last-child': {
          //   paddingBottom: 0,
          // },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.5)',
          background: '#1F1F1F',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 212, 255, 0.15)',
          color: '#00D4FF',
          fontWeight: 500,
          borderRadius: '6px',
          padding: '2px 8px',
          height: 'auto',
        },
        avatar: {
          width: 24,
          height: 24,
          marginRight: '-4px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#00D4FF',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
            color: '#33E0FF',
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00D4FF !important',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00D4FF !important',
            borderWidth: '2px',
          },
        },
        icon: {
          color: '#E0E0E0',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#A0A0A0',
          '&.Mui-focused': {
            color: '#00D4FF',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#333333',
          color: '#FFFFFF',
          fontSize: '0.8rem',
          borderRadius: '6px',
          padding: '6px 10px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.4)',
        },
        arrow: {
          color: '#333333',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#E0E0E0',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '@media (min-width: 600px)': {
            '--Grid-columnSpacing': '45px',
          },
          '@media (max-width: 599px)': {
            '--Grid-columnSpacing': '16px',
          },
          '&.MuiGrid-container': {
            justifyContent: 'flex-start',
            '@media (max-width: 599px)': {
              justifyContent: 'center',
            }
          }
        },
      },
    },
  },
});

export default theme;