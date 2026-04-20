import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/backend.response';
import { useServiciosStore, useFilteredServicios, useCategoriasStore } from '../store/backend.response';
import { ImageUpload } from './ImageUpload';
import { ServicioCardSkeletonGrid } from './ServicioCardSkeleton';

export function Dashboard() {
  const { user, logout } = useAuthStore();
  const {
    servicios,
    searchQuery,
    setSearchQuery,
    fetchServicios,
    createServicio,
    updateServicio,
    deleteServicio,
    isLoading,
  } = useServiciosStore();

  const { categoriaSeleccionada, categorias, setCategoria, extractCategoriasFromServicios } = useCategoriasStore();
  const filteredServicios = useFilteredServicios(categoriaSeleccionada);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_base: '',
    categoria: '',
    duracion_estimada_minutos: '',
    imagen: null,
  });

  useEffect(() => { fetchServicios(); }, [fetchServicios]);
  useEffect(() => { extractCategoriasFromServicios(servicios); }, [servicios, extractCategoriasFromServicios]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        precio_base: parseFloat(formData.precio_base),
        duracion_estimada_minutos: formData.duracion_estimada_minutos ? parseInt(formData.duracion_estimada_minutos) : undefined,
        imagen: formData.imagen || undefined
      };

      if (editingService) {
        await updateServicio(editingService.id, payload);
      } else {
        await createServicio(payload);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio_base: '', categoria: '', duracion_estimada_minutos: '', imagen: null });
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">⚙️</div>
            <div>
              <h1 className="font-bold text-lg">TechServices Hub</h1>
              <p className="text-xs text-gray-500">Bienvenido, {user?.nombre}</p>
            </div>
          </div>
          <button onClick={logout} className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1">
            <span>🚪</span> Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="w-full md:max-w-md relative">
            <span className="absolute left-3 top-3">🔍</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Buscar por nombre o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => { resetForm(); setIsDialogOpen(true); }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Nuevo Servicio
          </button>
        </div>

        {/* Categorías (Tabs) */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setCategoria(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${!categoriaSeleccionada ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${categoriaSeleccionada === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <ServicioCardSkeletonGrid />
        ) : filteredServicios.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <span className="text-4xl block mb-2">🔎</span>
            <h3 className="text-gray-500 font-medium">No encontramos servicios</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServicios.map((servicio) => (
              <div key={servicio.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="relative h-40 bg-gray-100">
                  {servicio.imagen_url ? (
                    <img src={servicio.imagen_url} alt={servicio.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-50">🛠️</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingService(servicio); setFormData({ ...servicio, precio_base: servicio.precio_base.toString(), duracion_estimada_minutos: servicio.duracion_estimada_minutos?.toString() || '', imagen: null }); setIsDialogOpen(true); }} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:bg-white text-blue-600">✏️</button>
                    <button onClick={() => confirm('¿Borrar?') && deleteServicio(servicio.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:bg-white text-red-600">🗑️</button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{servicio.categoria}</span>
                    <span className="text-sm font-bold text-gray-900">${servicio.precio_base}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{servicio.nombre}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{servicio.descripcion || 'Sin descripción'}</p>
                  <div className="flex items-center text-xs text-gray-400 gap-3 border-t pt-3">
                    <span className="flex items-center gap-1">⏱️ {servicio.duracion_estimada_minutos || 0} min</span>
                    <span className={`flex items-center gap-1 ${servicio.activo ? 'text-green-500' : 'text-gray-400'}`}>
                      ● {servicio.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Personalizado */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)} />
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingService ? 'Editar' : 'Nuevo'} Servicio</h2>
              <button onClick={() => setIsDialogOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del servicio"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Categoría"
                  list="cats"
                  value={formData.categoria}
                  onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                  required
                />
                <datalist id="cats">{categorias.map(c => <option key={c} value={c} />)}</datalist>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción"
                  rows={2}
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                />
                <ImageUpload onChange={f => setFormData({ ...formData, imagen: f })} existingImageUrl={editingService?.imagen_url} />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Precio"
                    value={formData.precio_base}
                    onChange={e => setFormData({ ...formData, precio_base: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Minutos"
                    value={formData.duracion_estimada_minutos}
                    onChange={e => setFormData({ ...formData, duracion_estimada_minutos: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}