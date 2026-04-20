import type { Service } from '@/store/backend.response';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:19898/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
  }
  return data;
};

export const servicesService = {
  async getAll(): Promise<Service[]> {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  async getById(id: number): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(response);
    return data;
  },

  async create(serviceFormData: FormData): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: serviceFormData,
    });
    const data = await handleResponse(response);
    return data.service;
  },

  async update(id: number, serviceFormData: FormData): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: serviceFormData,
    });
    const data = await handleResponse(response);
    return data.service;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse(response);
  },
};
