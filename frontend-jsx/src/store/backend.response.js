import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { serviciosService } from '../services/techServices.services';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });

      // Guardar token
      authService.saveToken(response.accessToken);

      // Si el backend devuelve el usuario, guardarlo
      if (response.user) {
        authService.saveUser(response.user);
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        // Si no devuelve usuario, al menos marcar como autenticado
        set({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  },

  checkAuth: () => {
    const token = authService.getToken();
    const user = authService.getUser();

    if (token) {
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export const useCategoriasStore = create((set) => ({
  categoriaSeleccionada: null,
  categorias: [],

  setCategoria: (categoria) => set({ categoriaSeleccionada: categoria }),

  setCategorias: (categorias) => set({ categorias }),

  extractCategoriasFromServicios: (servicios) => {
    const categoriasUnicas = Array.from(
      new Set(servicios.map((s) => s.categoria).filter(Boolean))
    ).sort();
    set({ categorias: categoriasUnicas });
  },
}));

export const useServiciosStore = create((set, get) => ({
  servicios: [],
  filteredServicios: [],
  searchQuery: '',
  isLoading: false,
  error: null,

  setServicios: (servicios) => {
    set({ servicios });
    get().filterServicios(get().searchQuery);
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterServicios(query);
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  fetchServicios: async () => {
    set({ isLoading: true, error: null });
    try {
      const servicios = await serviciosService.getAll();
      get().setServicios(servicios);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar servicios';
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createServicio: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newServicio = await serviciosService.create(data);
      set((state) => ({
        servicios: [...state.servicios, newServicio],
        isLoading: false,
      }));
      get().filterServicios(get().searchQuery);
      return newServicio;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear servicio';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateServicio: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedServicio = await serviciosService.update(id, data);
      set((state) => ({
        servicios: state.servicios.map((s) => (s.id === id ? updatedServicio : s)),
        isLoading: false,
      }));
      get().filterServicios(get().searchQuery);
      return updatedServicio;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar servicio';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteServicio: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await serviciosService.delete(id);
      set((state) => ({
        servicios: state.servicios.filter((s) => s.id !== id),
        isLoading: false,
      }));
      get().filterServicios(get().searchQuery);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al eliminar servicio';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  filterServicios: (query) => {
    const { servicios } = get();

    if (!query.trim()) {
      set({ filteredServicios: servicios });
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = servicios.filter(
      (servicio) =>
        servicio.nombre.toLowerCase().includes(lowerQuery) ||
        (servicio.descripcion && servicio.descripcion.toLowerCase().includes(lowerQuery)) ||
        (servicio.categoria && servicio.categoria.toLowerCase().includes(lowerQuery))
    );

    set({ filteredServicios: filtered });
  },
}));

/**
 * Hook personalizado que combina filtrado por búsqueda y categoría
 */
export const useFilteredServicios = (categoriaSeleccionada) => {
  const { filteredServicios } = useServiciosStore();

  if (!categoriaSeleccionada) return filteredServicios;

  return filteredServicios.filter(
    (servicio) => servicio.categoria === categoriaSeleccionada
  );
};