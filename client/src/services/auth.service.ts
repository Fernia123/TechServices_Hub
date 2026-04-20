import type { LoginCredentials, AuthResponse } from '@/store/backend.response';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:19898/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // envía/recibe cookies (refreshToken)
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    return data;
  },

  async register(payload: { nombre: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error al registrarse');
    }

    return data;
  },

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken(): void {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
