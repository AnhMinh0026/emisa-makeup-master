import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App.jsx';

// Monolith Editorial Design System — d:\DESIGN.md compliant
const editorialTheme = createTheme({
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 0, // Strictly Sharp (0px) — no rounded corners anywhere

  // Map DESIGN.md primary (#000000) to Mantine's primaryColor
  primaryColor: 'dark',
  colors: {
    dark: [
      // Scaled from DESIGN.md color tokens:
      // [0] surface-container-highest #e2e2e2
      // [1] surface-container-high    #e8e8e8
      // [2] surface-container         #eeeeee
      // [3] outline                   #7e7576  → secondary #5e5e5e
      // [4] on-surface-variant        #4c4546
      // [5] inverse-surface           #2f3131
      // [6] primary-container         #1b1b1b
      // [7] on-background / on-surface #1a1c1c
      // [8] on-surface                #1a1c1c
      // [9] primary (black)           #000000
      '#e2e2e2', '#e8e8e8', '#eeeeee', '#5e5e5e', '#4c4546',
      '#2f3131', '#1b1b1b', '#1a1c1c', '#1a1c1c', '#000000',
    ],
  },

  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '900',
  },

  other: {
    // DESIGN.md color tokens
    surface: '#f9f9f9',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f3f3f4',
    surfaceContainer: '#eeeeee',
    surfaceContainerHigh: '#e8e8e8',
    surfaceContainerHighest: '#e2e2e2',
    onSurface: '#1a1c1c',
    onSurfaceVariant: '#4c4546',
    primary: '#000000',
    onPrimary: '#ffffff',
    secondary: '#5e5e5e',
    outline: '#7e7576',
    outlineVariant: '#cfc4c5',
    background: '#f9f9f9',
    onBackground: '#1a1c1c',
    // DESIGN.md spacing tokens
    sectionGap: '160px',
    contentGap: '80px',
    marginDesktop: '64px',
    gutter: '32px',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={editorialTheme}>
      <Notifications position="top-right" autoClose={3500} limit={5} />
      <App />
    </MantineProvider>
  </StrictMode>,
);