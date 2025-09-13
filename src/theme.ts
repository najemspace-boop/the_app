// theme.ts
import { createTheme } from '@mantine/core';

// Do not forget to pass theme to MantineProvider
export const theme = createTheme({
  fontFamily: 'Tajawal, serif',
  primaryColor: 'blue',
  colors: {
    // Custom color palette
    brand: [
      '#f0f9ff',
      '#e0f2fe', 
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e'
    ]
  },
  breakpoints: {
    xs: '30em',
    sm: '48em', 
    md: '64em',
    lg: '74em',
    xl: '90em',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
});