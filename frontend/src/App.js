import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './components/AppRouter';
import theme from './theme/tokens';
import GlobalStyle from './theme/GlobalStyle';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <GlobalStyle />
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#171B22',
                color: '#E8EDF2',
                border: '1px solid #252B34',
              },
              success: {
                style: {
                  background: '#27C093',
                  color: '#0B0D10',
                },
              },
              error: {
                style: {
                  background: '#F26D6D',
                  color: '#0B0D10',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;