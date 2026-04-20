// Servicio de autenticación para manejar el login y JWT
import type { LoginCredentials, AuthResponse, Usuario } from '@/store/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para incluir cookies (refreshToken)
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Credenciales inválidas' }));
      throw new Error(error.error || 'Error al iniciar sesión');
    }

    const data = await response.json();

    // El backend devuelve "token" en lugar de "accessToken"
    return {
      message: data.message,
      accessToken: data.token,
      user: data.user,
    };
  },

  /**
   * Refrescar el access token usando el refresh token (cookie)
   */
  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Sesión expirada');
    }

    const data = await response.json();

    // El backend devuelve "token" en lugar de "accessToken"
    return { accessToken: data.token };
  },

  /**
   * Cerrar sesión (limpia refresh token del servidor)
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
    } finally {
      this.removeToken();
      this.removeUser();
    }
  },

  /**
   * Guardar token en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem('accessToken', token);
  },

  /**
   * Obtener token de localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  },

  /**
   * Eliminar token de localStorage
   */
  removeToken(): void {
    localStorage.removeItem('accessToken');
  },

  /**
   * Guardar información del usuario autenticado
   */
  saveUser(user: Usuario): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Obtener información del usuario autenticado
   */
  getUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Eliminar información del usuario
   */
  removeUser(): void {
    localStorage.removeItem('user');
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Obtener headers de autenticación
   */
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};
