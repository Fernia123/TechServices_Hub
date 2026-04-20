// Servicio para manejar operaciones CRUD de servicios
import type { Servicio, CrearServicioDTO, ActualizarServicioDTO } from '@/store/types';
import { authService } from '@/services/auth.service';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
    throw new Error(error.error || error.message || 'Error desconocido');
  }
  return response.json();
};

export const serviciosService = {
  /**
   * Obtener todos los servicios activos
   */
  async getAll(): Promise<Servicio[]> {
    const response = await fetch(`${API_BASE_URL}/servicios`, {
      headers: authService.getAuthHeaders(),
    });
    return handleResponse<Servicio[]>(response);
  },

  /**
   * Obtener un servicio por ID
   */
  async getById(id: number): Promise<Servicio> {
    const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
      headers: authService.getAuthHeaders(),
    });
    return handleResponse<Servicio>(response);
  },

  /**
   * Crear un nuevo servicio (con soporte para imagen)
   */
  async create(data: CrearServicioDTO): Promise<Servicio> {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('precio_base', data.precio_base.toString());
    formData.append('categoria', data.categoria);

    if (data.descripcion) formData.append('descripcion', data.descripcion);
    if (data.duracion_estimada_minutos) {
      formData.append('duracion_estimada_minutos', data.duracion_estimada_minutos.toString());
    }
    if (data.activo !== undefined) formData.append('activo', data.activo.toString());
    if (data.imagen) formData.append('imagen', data.imagen);

    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/servicios`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // No incluir Content-Type para que el navegador lo establezca automáticamente con boundary
      },
      body: formData,
    });
    return handleResponse<Servicio>(response);
  },

  /**
   * Actualizar un servicio existente (con soporte para imagen)
   */
  async update(id: number, data: ActualizarServicioDTO): Promise<Servicio> {
    const formData = new FormData();

    if (data.nombre) formData.append('nombre', data.nombre);
    if (data.descripcion !== undefined) formData.append('descripcion', data.descripcion);
    if (data.precio_base) formData.append('precio_base', data.precio_base.toString());
    if (data.categoria) formData.append('categoria', data.categoria);
    if (data.duracion_estimada_minutos) {
      formData.append('duracion_estimada_minutos', data.duracion_estimada_minutos.toString());
    }
    if (data.activo !== undefined) formData.append('activo', data.activo.toString());
    if (data.imagen) formData.append('imagen', data.imagen);

    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return handleResponse<Servicio>(response);
  },

  /**
   * Eliminar un servicio (borrado lógico)
   */
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/servicios/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    await handleResponse<void>(response);
  },

  /**
   * Buscar servicios por término (nombre o descripción)
   */
  async search(query: string): Promise<Servicio[]> {
    const response = await fetch(
      `${API_BASE_URL}/servicios/search?q=${encodeURIComponent(query)}`,
      {
        headers: authService.getAuthHeaders(),
      }
    );
    return handleResponse<Servicio[]>(response);
  },
};
