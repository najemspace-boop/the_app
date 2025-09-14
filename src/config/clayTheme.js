import React from 'react';

// Claymorphism Theme Configuration and Utilities
export const clayTheme = {
  colors: {
    light: {
      primary: '#5b21b6',    // purple-700
      secondary: '#4b5563',  // gray-600
      tertiary: '#9ca3af',   // gray-400
      success: '#059669',    // emerald-600
      warning: '#d97706',    // amber-600
      error: '#dc2626',      // red-600
      info: '#2563eb',       // blue-600
    },
    dark: {
      primary: '#c4b5fd',    // violet-300
      secondary: '#9ca3af',  // gray-400
      tertiary: '#4b5563',   // gray-600
      success: '#34d399',    // emerald-300
      warning: '#fbbf24',    // amber-300
      error: '#f87171',      // red-300
      info: '#60a5fa',       // blue-300
    }
  },
  
  shadows: {
    light: {
      outer1: '15px 15px 30px rgba(209, 196, 233, 0.2)',
      outer2: '-15px -15px 30px rgba(255, 255, 255, 0.9)',
      inset: 'inset 1px 1px 2px rgba(255, 255, 255, 0.8)',
      button: '8px 8px 16px rgba(209, 196, 233, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.9)',
      input: 'inset 8px 8px 16px rgba(209, 196, 233, 0.2), inset -8px -8px 16px rgba(255, 255, 255, 0.8)'
    },
    dark: {
      outer1: '15px 15px 30px rgba(0, 0, 0, 0.5)',
      outer2: '-15px -15px 30px rgba(50, 45, 69, 0.25)',
      inset: 'inset 1px 1px 2px rgba(50, 45, 69, 0.5)',
      button: '8px 8px 16px rgba(0, 0, 0, 0.4), -8px -8px 16px rgba(60, 53, 82, 0.2)',
      input: 'inset 8px 8px 16px rgba(0, 0, 0, 0.3), inset -8px -8px 16px rgba(60, 53, 82, 0.15)'
    }
  },
  
  gradients: {
    light: {
      background: 'linear-gradient(135deg, #f8f6ff 0%, #f0f8ff 50%, #f6fff8 100%)',
      card: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 248, 255, 0.8))',
      button: 'linear-gradient(145deg, #e8e0ff, #d1c4e9)',
      input: 'linear-gradient(145deg, #f8f6ff, #f0f8ff)'
    },
    dark: {
      background: 'linear-gradient(135deg, #626973 0%, #5a6269 50%, #525861 100%)',
      card: 'linear-gradient(145deg, #6b7280, #626973)',
      button: 'linear-gradient(145deg, #737a85, #6b7280)',
      input: 'linear-gradient(145deg, #626973, #5a6269)'
    }
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    full: '50%'
  },
  
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.25rem',  // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    '4xl': '2.5rem', // 40px
    '5xl': '3rem',   // 48px
  }
};

// Theme utility functions
export const getTheme = () => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

export const toggleTheme = () => {
  const isDark = getTheme() === 'dark';
  if (isDark) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  
  // Dispatch custom event for theme change
  window.dispatchEvent(new CustomEvent('themeChanged', { 
    detail: { theme: getTheme() } 
  }));
};

export const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// CSS-in-JS helper for dynamic styling
export const clayStyles = (theme = 'light') => ({
  card: {
    background: clayTheme.gradients[theme].card,
    borderRadius: clayTheme.borderRadius.xl,
    boxShadow: `${clayTheme.shadows[theme].outer1}, ${clayTheme.shadows[theme].outer2}, ${clayTheme.shadows[theme].inset}`,
    border: theme === 'light' 
      ? '1px solid rgba(255, 255, 255, 0.4)' 
      : '1px solid rgba(50, 45, 69, 0.5)',
    transition: 'all 0.3s ease',
    padding: clayTheme.spacing['2xl']
  },
  
  button: {
    background: clayTheme.gradients[theme].button,
    color: clayTheme.colors[theme].primary,
    borderRadius: clayTheme.borderRadius.lg,
    boxShadow: clayTheme.shadows[theme].button,
    border: 'none',
    padding: `${clayTheme.spacing.md} ${clayTheme.spacing['2xl']}`,
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  input: {
    background: clayTheme.gradients[theme].input,
    color: clayTheme.colors[theme].primary,
    borderRadius: clayTheme.borderRadius.lg,
    boxShadow: clayTheme.shadows[theme].input,
    border: theme === 'light' 
      ? '1px solid rgba(209, 196, 233, 0.3)' 
      : '1px solid rgba(60, 53, 82, 0.4)',
    padding: `${clayTheme.spacing.md} ${clayTheme.spacing.lg}`,
    width: '100%',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease'
  }
});

// Clay component factory functions
export const createClayButton = (variant = 'primary', size = 'md') => {
  const baseClasses = 'clay-button';
  const variantClass = variant !== 'primary' ? `clay-button-${variant}` : '';
  const sizeClass = size !== 'md' ? `clay-button-${size}` : '';
  
  return [baseClasses, variantClass, sizeClass].filter(Boolean).join(' ');
};

export const createClayCard = (size = 'md', variant = 'default') => {
  const baseClasses = 'clay-card';
  const sizeClass = size !== 'md' ? `clay-card-${size}` : '';
  const variantClass = variant !== 'default' ? `clay-card-${variant}` : '';
  
  return [baseClasses, sizeClass, variantClass].filter(Boolean).join(' ');
};

export const createClayInput = (size = 'md') => {
  const baseClasses = 'clay-input';
  const sizeClass = size !== 'md' ? `clay-input-${size}` : '';
  
  return [baseClasses, sizeClass].filter(Boolean).join(' ');
};

// Hook for React components
export const useClayTheme = () => {
  const [currentTheme, setCurrentTheme] = React.useState(getTheme());
  
  React.useEffect(() => {
    const handleThemeChange = (event) => {
      setCurrentTheme(event.detail.theme);
    };
    
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);
  
  return {
    theme: currentTheme,
    toggleTheme,
    isDark: currentTheme === 'dark',
    colors: clayTheme.colors[currentTheme],
    shadows: clayTheme.shadows[currentTheme],
    gradients: clayTheme.gradients[currentTheme]
  };
};

export default clayTheme;
