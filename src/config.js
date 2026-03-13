const DEFAULT_PROD_API_BASE = 'https://recipebook-backend-stqo.onrender.com';

export const API_BASE =
   import.meta.env.VITE_API_BASE_URL ||
   (import.meta.env.PROD ? DEFAULT_PROD_API_BASE : '');

export const apiUrl = path => {
   const normalizedPath =
      typeof path === 'string'
         ? path.startsWith('/')
            ? path
            : `/${path}`
         : '';
   return `${API_BASE}${normalizedPath}`;
};

