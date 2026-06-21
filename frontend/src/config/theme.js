import { createTheme } from '@mantine/core';

export const appTheme = createTheme({
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 0, // Strictly Sharp (0px) — no rounded corners anywhere

  // Map the primary design token to the theme's primary color property.
  primaryColor: 'dark',
  colors: {
    dark: [
      // Scaled from core color tokens:
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
    fontFamily: '"Playfair Display", serif',
    fontWeight: '900',
  },

  other: {
      // Core color tokens
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
    // Standardized spacing tokens
    sectionGap: '160px',
    contentGap: '80px',
    marginDesktop: '64px',
    gutter: '32px',
  },
});
