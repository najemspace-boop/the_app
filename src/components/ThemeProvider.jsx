import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeProviderContext = createContext({
  theme: 'system',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'app-theme',
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    let appliedTheme = theme;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      appliedTheme = systemTheme;
    }

    // Apply theme to both root and body
    root.classList.add(appliedTheme);
    body.classList.add(appliedTheme);
    
    // Force dark theme styling on root elements
    if (appliedTheme === 'dark') {
      root.style.backgroundColor = 'hsl(240 12% 8%)';
      root.style.color = 'hsl(0 0% 98%)';
      body.style.backgroundColor = 'hsl(240 12% 8%)';
      body.style.color = 'hsl(0 0% 98%)';
    } else {
      root.style.backgroundColor = 'hsl(0 0% 100%)';
      root.style.color = 'hsl(222.2 84% 4.9%)';
      body.style.backgroundColor = 'hsl(0 0% 100%)';
      body.style.color = 'hsl(222.2 84% 4.9%)';
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export default ThemeProvider;
