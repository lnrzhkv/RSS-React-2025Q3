'use client';

import {
  createContext,
  useCallback,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Theme } from '@/types.ts';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);

interface ProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    setTheme(initialTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
