import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {}, toggleTheme: () => {} });

function getInitialTheme() {
  try {
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    try { window.localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;


