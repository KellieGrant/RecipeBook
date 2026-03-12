export const API_BASE =
   import.meta.env.VITE_API_BASE_URL || '';

export const apiUrl = path => {
   const normalizedPath =
      typeof path === 'string'
         ? path.startsWith('/')
            ? path
            : `/${path}`
         : '';
   return `${API_BASE}${normalizedPath}`;
};

