import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    colors: {
      primary: '#007BFF',
      secondary: '#28A745',
      accent: '#FD7E14',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
      info: '#17A2B8',
      background: darkMode ? '#0f0f23' : '#F8F9FA',
      surface: darkMode ? '#1a1a35' : '#FFFFFF',
      surfaceSecondary: darkMode ? '#242447' : '#F1F3F4',
      text: darkMode ? '#FFFFFF' : '#212529',
      textSecondary: darkMode ? '#B8B8CC' : '#6C757D',
      textMuted: darkMode ? '#8A8A9E' : '#9CA3AF',
      border: darkMode ? '#2A2A4A' : '#DEE2E6',
      cardBg: darkMode ? '#1e1e3a' : '#FFFFFF',
      inputBg: darkMode ? '#252548' : '#FFFFFF',
      navBg: darkMode ? 'rgba(15, 15, 35, 0.95)' : 'rgba(248, 249, 250, 0.95)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  };

  const value = {
    theme,
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}