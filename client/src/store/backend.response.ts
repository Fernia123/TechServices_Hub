export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: string;
}
