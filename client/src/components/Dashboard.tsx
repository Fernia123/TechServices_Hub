import { useState, useEffect } from 'react';
import { servicesService } from '@/services/techServices.services';
import type { Service } from '@/store/backend.response';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredServices(
      services.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, services]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const fetchServices = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await servicesService.getAll();
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los servicios. ¿Está el servidor corriendo?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSaving(true);

    const fd = new FormData();
    fd.append('name', formData.name.trim());
    fd.append('description', formData.description.trim());
    fd.append('price', formData.price.toString());
    fd.append('category', formData.category.trim());
    if (imagenFile) {
       fd.append('imagen', imagenFile);
    }

    try {
      if (editingService?.id) {
        await servicesService.update(editingService.id, fd);
        showSuccess('Servicio actualizado correctamente');
      } else {
        await servicesService.create(fd);
        showSuccess('Servicio creado correctamente');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar el servicio');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      await servicesService.delete(id);
      showSuccess('Servicio eliminado correctamente');
      fetchServices();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el servicio');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
    });
    setImagenFile(null);
    setFormError('');
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '' });
    setImagenFile(null);
    setEditingService(null);
    setFormError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-server text-white"></i>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 leading-none">TechServices Hub</h1>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5 font-semibold">Admin Panel</p>
              </div>
            </div>
            <button
              id="btn-logout"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* SUCCESS TOAST */}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg flex items-center gap-2">
            <i className="fas fa-check-circle"></i>
            {successMsg}
          </div>
        )}

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg flex items-start gap-3">
            <i className="fas fa-exclamation-triangle mt-0.5 flex-shrink-0"></i>
            <div>
              <p className="font-semibold">Error de conexión</p>
              <p className="mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Mis Servicios</h2>
            <p className="text-gray-500 text-sm">{filteredServices.length} registros encontrados</p>
          </div>
          <button
            id="btn-nuevo-servicio"
            onClick={() => { resetForm(); setIsDialogOpen(true); }}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200"
          >
            <i className="fas fa-plus"></i>
            Nuevo Servicio
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-8">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            id="input-search"
            type="text"
            placeholder="Buscar por nombre, categoría o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
          />
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <i className="fas fa-circle-notch fa-spin text-blue-500 text-3xl mb-4"></i>
            <p className="text-gray-500">Cargando servicios...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-folder-open text-gray-300 text-3xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No hay servicios que mostrar</h3>
            <p className="text-gray-500 mt-1">
              {searchQuery ? 'Prueba a cambiar tu búsqueda.' : 'Agrega tu primer servicio.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                {service.imagen ? (
                   <img
                     src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:19898'}/uploads/${service.imagen}`}
                     alt={service.name}
                     className="w-full h-40 object-cover border-b border-gray-100"
                   />
                 ) : (
                   <div className="w-full h-40 bg-gray-100 border-b border-gray-200 flex flex-col items-center justify-center text-gray-400">
                     <i className="fas fa-image text-3xl mb-2"></i>
                     <span className="text-xs font-semibold">Sin imagen</span>
                   </div>
                 )}
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {service.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        id={`btn-edit-${service.id}`}
                        onClick={() => handleEdit(service)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        id={`btn-delete-${service.id}`}
                        onClick={() => service.id && handleDelete(service.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
                    {service.description || <span className="italic text-gray-400">Sin descripción</span>}
                  </p>
                  <div className="pt-4 border-t border-gray-50 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-blue-600">${service.price.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Precio Final</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-screen">
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button
                id="btn-close-modal"
                onClick={() => { setIsDialogOpen(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form id="form-servicio" onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">

              {/* Form Error */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg flex items-start gap-2">
                  <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nombre del Servicio *</label>
                <input
                  id="input-nombre"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ej: Cloud Hosting"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Descripción</label>
                <textarea
                  id="input-descripcion"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-24 resize-none transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del servicio..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Categoría *</label>
                  <input
                    id="input-categoria"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Ej: Redes"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Precio (USD) *</label>
                  <input
                    id="input-precio"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Imagen del Servicio {editingService ? '(Opcional)' : ''}</label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <i className={`fas fa-cloud-upload-alt text-2xl mb-2 ${imagenFile ? 'text-blue-500' : 'text-gray-400'}`}></i>
                      <p className="text-xs text-gray-500">
                        {imagenFile ? <span className="font-semibold text-blue-600">{imagenFile.name}</span> : <span>Clic para subir imagen (JPG/PNG)</span>}
                      </p>
                    </div>
                    <input 
                      id="input-imagen" 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg, image/png, image/webp" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setImagenFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  id="btn-cancelar"
                  onClick={() => { setIsDialogOpen(false); resetForm(); }}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-guardar"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-circle-notch fa-spin"></i>
                      Guardando...
                    </span>
                  ) : (
                    editingService ? 'Guardar Cambios' : 'Crear Servicio'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}