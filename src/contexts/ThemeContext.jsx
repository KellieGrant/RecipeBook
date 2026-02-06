import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
   const ctx = useContext(ThemeContext);
   if (!ctx) {
      throw new Error('useTheme must be used within ThemeProvider');
   }
   return ctx;
};

export const ThemeProvider = ({ children }) => {
   const [isDark, setIsDark] = useState(() => {
      if (typeof window === 'undefined') return false;
      const stored = localStorage.getItem('recipebook_theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
   });

   useEffect(() => {
      const root = document.documentElement;
      if (isDark) {
         root.classList.add('dark');
         localStorage.setItem('recipebook_theme', 'dark');
      } else {
         root.classList.remove('dark');
         localStorage.setItem('recipebook_theme', 'light');
      }
   }, [isDark]);

   const toggleTheme = () => setIsDark(prev => !prev);

   return (
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};
