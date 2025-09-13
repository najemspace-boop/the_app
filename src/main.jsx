import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { MantineProvider } from '@mantine/core';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { theme } from './theme';
import App from './App';
import './index.css';
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MantineProvider theme={theme}>
          <AuthProvider>
            <HeroUIProvider>
              <ToastProvider />
              <App />
            </HeroUIProvider>
          </AuthProvider>
        </MantineProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
