import React, { useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  const showToast = useCallback((msg, type = 'info', duration = 6000) => {
    setMessage(msg);
    setSeverity(type);
    setAutoHideDuration(duration);
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const ToastComponent = (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showToast, ToastComponent };
}
