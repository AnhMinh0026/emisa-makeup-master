import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { appTheme } from './config/theme.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={appTheme}>
      <Notifications position="top-right" autoClose={3500} limit={5} />
      <App />
    </MantineProvider>
  </StrictMode>,
);