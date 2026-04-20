import { authService } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || error.message || 'Error desconocido');
  }
  return response.json();
};

export const serviciosService = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/services`, {
      headers: authService.getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      headers: authService.getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async create(data) {
    const formData = new FormData();
    formData.append('name', data.nombre);
    formData.append('price', data.precio_base.toString());
    formData.append('category', data.categoria);
    if (data.descripcion) formData.append('description', data.descripcion);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: authService.getAuthHeaders(), // Ojo: Fetch genera el Content-Type multipart automáticamente
      body: formData,
    });
    return handleResponse(response);
  },

  async update(id, data) {
    const formData = new FormData();
    if (data.nombre) formData.append('name', data.nombre);
    if (data.precio_base) formData.append('price', data.precio_base.toString());
    if (data.categoria) formData.append('category', data.categoria);
    if (data.descripcion) formData.append('description', data.descripcion);
    if (data.imagen) formData.append('imagen', data.imagen);

    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: formData,
    });
    return handleResponse(response);
  },

  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    await handleResponse(response);
  }
};