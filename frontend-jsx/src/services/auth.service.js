const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Credenciales inválidas' }));
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return {
      message: data.message,
      accessToken: data.token,
      user: data.user,
    };
  },

  async refreshToken() {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('No se pudo refrescar el token');
    return response.json();
  },

  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      this.removeToken();
      this.removeUser();
    }
  },

  saveToken: (token) => localStorage.setItem('accessToken', token),
  getToken: () => localStorage.getItem('accessToken'),
  removeToken: () => localStorage.removeItem('accessToken'),
  saveUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try { return JSON.parse(userStr); } catch { return null; }
  },
  removeUser: () => localStorage.removeItem('user'),
  isAuthenticated: function() { return !!this.getToken(); },
  getAuthHeaders: function() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};