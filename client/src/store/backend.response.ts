// ============================================
// Tipos de respuesta del backend
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;      // accessToken del backend
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: 'cliente' | 'tecnico' | 'admin';
  };
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imagen?: string | null;
  activo?: boolean;
  createdAt?: string;
}
