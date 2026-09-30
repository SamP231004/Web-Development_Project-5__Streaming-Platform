import { createContext, useCallback, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotifyContext = createContext(() => {});

export const NotifyProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', severity: 'info', key: 0 });
  const [open, setOpen] = useState(false);

  const notify = useCallback((message, severity = 'info') => {
    setToast({ message, severity, key: Date.now() });
    setOpen(true);
  }, []);

  const handleClose = (_, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        key={toast.key}
        open={open}
        autoHideDuration={3500}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
};

export const useNotify = () => useContext(NotifyContext);
