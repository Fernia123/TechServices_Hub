import type { Service } from "@/store/backend.response";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const servicesService = {
  async getAll(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener servicios');
    }

    return response.json();
  },

  async getById(id: number): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el servicio');
    }

    return response.json();
  },

  async create(service: Service): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Error al crear el servicio');
    }

    return response.json();
  },

  async update(id: number, service: Service): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el servicio');
    }

    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el servicio');
    }
  },
};
