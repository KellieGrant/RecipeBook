export const getAuthHeaders = () => {
   try {
      const stored = localStorage.getItem('recipebook_auth');
      if (!stored) return {};
      const { token } = JSON.parse(stored);
      return token ? { Authorization: `Bearer ${token}` } : {};
   } catch {
      return {};
   }
};
