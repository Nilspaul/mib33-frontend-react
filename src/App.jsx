import './App.scss'
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './AppRouter';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Reset MUI-Theme
const theme = createTheme({
  typography: {
    fontFamily: '',
    fontSize: 18,
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'black'
        }
      }
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppRouter />
      </Router>
    </ThemeProvider>
  );
}

export default App
