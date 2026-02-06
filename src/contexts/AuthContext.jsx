import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
   const ctx = useContext(AuthContext);
   if (!ctx) {
      throw new Error('useAuth must be used within AuthProvider');
   }
   return ctx;
};

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [token, setToken] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const stored = localStorage.getItem('recipebook_auth');
      if (stored) {
         try {
            const { user: u, token: t } = JSON.parse(stored);
            if (u && t) {
               setUser(u);
               setToken(t);
            }
         } catch (e) {
            localStorage.removeItem('recipebook_auth');
         }
      }
      setLoading(false);
   }, []);

   const login = (userData, authToken) => {
      setUser(userData);
      setToken(authToken);
      localStorage.setItem(
         'recipebook_auth',
         JSON.stringify({ user: userData, token: authToken })
      );
   };

   const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('recipebook_auth');
   };

   const getAuthHeaders = () => {
      if (!token) return {};
      return { Authorization: `Bearer ${token}` };
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            token,
            loading,
            isAuthenticated: !!user && !!token,
            login,
            logout,
            getAuthHeaders,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};
