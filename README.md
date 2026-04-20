# TechServices Hub - Cliente Frontend

Sistema de gestión de servicios tecnológicos con React, TypeScript, Tailwind CSS v4 y Zustand.

## 🎯 Características Implementadas

### ✅ Autenticación con JWT
- Login con email y contraseña
- Access Token + Refresh Token (cookie HttpOnly)
- Persistencia de sesión
- Auto-refresh de tokens
- Logout seguro

### ✅ Gestión de Servicios (CRUD Completo)
- **Create**: Crear nuevos servicios con nombre, descripción, precio y duración
- **Read**: Listar todos los servicios activos
- **Update**: Editar servicios existentes
- **Delete**: Borrado lógico de servicios

### ✅ Buscador en Tiempo Real + Filtros Pro
- Filtrado instantáneo mientras escribes
- Búsqueda en: nombre, descripción y categoría
- **Filtrado por categorías** con tabs dinámicos
- Contador de resultados encontrados
- Sin delay, completamente reactivo

### ✅ Gestión de Multimedia
- **Upload de imágenes** para servicios con FormData
- Preview de imagen antes de guardar
- Validación de tipo y tamaño (máx 5MB)
- Eliminación de imagen anterior al actualizar
- Visualización de imágenes en cards

### ✅ Feedback Visual UX
- **Skeletons de carga** mientras consulta la BD
- Spinners en botones durante operaciones
- Estados de carga en toda la app
- Transiciones suaves

### ✅ Estado Global con Zustand
- Store de autenticación (`useAuthStore`)
- Store de servicios (`useServiciosStore`)
- Store de categorías (`useCategoriasStore`)
- Gestión centralizada del estado
- Separación de responsabilidades

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── Login.tsx                  # Página de autenticación
│   │   ├── Dashboard.tsx              # Panel principal con CRUD
│   │   ├── ImageUpload.tsx            # Componente de upload de imágenes
│   │   ├── ServicioCardSkeleton.tsx   # Skeleton de carga para cards
│   │   └── ui/                        # Componentes UI (shadcn/ui)
│   ├── services/
│   │   ├── authService.ts             # Servicio de autenticación
│   │   └── servicesService.ts         # Servicio con FormData para uploads
│   ├── store/
│   │   ├── types.ts                   # Interfaces TypeScript (basadas en BD)
│   │   ├── useAuthStore.ts            # Store de autenticación
│   │   ├── useServiciosStore.ts       # Store de servicios
│   │   └── useCategoriasStore.ts      # Store de categorías y filtros
│   └── App.tsx                        # Componente principal
```

## 🗄️ Esquema de Base de Datos

El frontend está alineado con el siguiente esquema PostgreSQL:

### Tabla: `servicios`
```sql
CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base >= 0),
    categoria VARCHAR(80) NOT NULL,           -- ← NUEVO: Categoría del servicio
    duracion_estimada_minutos INT CHECK (duracion_estimada_minutos > 0),
    imagen_url VARCHAR(500),                  -- ← NUEVO: URL de la imagen
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('cliente', 'tecnico', 'admin')),
    contrasena_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Ver esquema completo en `INTEGRATION.md`

## 🔌 Integración con Backend

### 1. Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
VITE_API_URL=http://localhost:3000/api
```

### 2. Endpoints Requeridos

#### Autenticación (`/api/auth`)
```
POST   /api/auth/login     # Login con email/password
POST   /api/auth/refresh   # Refrescar access token
POST   /api/auth/logout    # Cerrar sesión
```

#### Servicios (`/api/servicios`)
```
GET    /api/servicios      # Listar todos
GET    /api/servicios/:id  # Obtener por ID
POST   /api/servicios      # Crear nuevo (FormData con imagen)
PUT    /api/servicios/:id  # Actualizar (FormData con imagen)
DELETE /api/servicios/:id  # Eliminar (soft delete)
```

**IMPORTANTE**: Los endpoints POST y PUT ahora aceptan `multipart/form-data` en lugar de JSON para soportar upload de imágenes.

Ver documentación completa de endpoints en `INTEGRATION.md`

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
pnpm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con la URL de tu backend
```

### 3. Iniciar desarrollo
```bash
pnpm run dev
```

## 📦 Dependencias Principales

- **React 18**: Framework UI
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Estilos
- **Zustand**: Gestión de estado global
- **Lucide React**: Iconos
- **Sonner**: Notificaciones toast
- **shadcn/ui**: Componentes UI

## 💡 Uso de Stores

### Store de Autenticación

```typescript
import { useAuthStore } from './store/useAuthStore';

const { user, isAuthenticated, login, logout } = useAuthStore();

// Login
await login('usuario@ejemplo.com', 'password123');

// Logout
await logout();

// Usuario actual
console.log(user); // { id, nombre, email, rol, activo, ... }
```

### Store de Servicios

```typescript
import { useServiciosStore } from './store/useServiciosStore';

const {
  servicios,           // Todos los servicios
  filteredServicios,   // Servicios filtrados por búsqueda
  searchQuery,         // Query de búsqueda actual
  setSearchQuery,      // Actualizar búsqueda
  fetchServicios,      // Cargar servicios del backend
  createServicio,      // Crear nuevo servicio
  updateServicio,      // Actualizar servicio
  deleteServicio,      // Eliminar servicio
} = useServiciosStore();

// Crear servicio
await createServicio({
  nombre: 'Desarrollo Web',
  descripcion: 'Aplicaciones modernas',
  precio_base: 1500.00,
  duracion_estimada_minutos: 480
});

// Buscar en tiempo real
setSearchQuery('desarrollo');
```

## 🔍 Buscador en Tiempo Real + Filtros Pro

El sistema combina búsqueda por texto con filtrado por categorías:

### Búsqueda por Texto
```typescript
// En el componente
const { searchQuery, setSearchQuery } = useServiciosStore();

// Al escribir en el input
setSearchQuery('mantenimiento'); // ← Filtra en nombre, descripción y categoría
```

### Filtrado por Categorías
```typescript
const { categoriaSeleccionada, setCategoria, categorias } = useCategoriasStore();

// Filtrar por categoría
setCategoria('Soporte Técnico');

// Ver todas las categorías
setCategoria(null);
```

### Uso Combinado
El hook `useFilteredServicios` combina ambos filtros automáticamente:

```typescript
const { categoriaSeleccionada } = useCategoriasStore();
const filteredServicios = useFilteredServicios(categoriaSeleccionada);
// Resultado: servicios filtrados por búsqueda Y categoría
```

## 🎨 Interfaces TypeScript

Todas las interfaces están en `src/app/store/types.ts` y están alineadas con el esquema de la BD:

```typescript
interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  duracion_estimada_minutos?: number;
  activo: boolean;
  creado_en: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'cliente' | 'tecnico' | 'admin';
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}
```

## 🔐 Seguridad

- Access tokens en `localStorage`
- Refresh tokens en cookies `HttpOnly` (más seguro)
- Validación de tokens en cada petición
- Auto-refresh cuando el token expira
- Logout limpia tokens del cliente y servidor

## 📚 Documentación Adicional

- `INTEGRATION.md` - Guía completa de integración con backend
- `.env.example` - Variables de entorno necesarias
- `src/app/store/types.ts` - Todas las interfaces TypeScript

## 📤 Upload de Imágenes

El componente `ImageUpload` maneja el upload de forma visual:

```typescript
<ImageUpload
  value={formData.imagen}
  onChange={(file) => setFormData({ ...formData, imagen: file })}
  existingImageUrl={editingService?.imagen_url}
/>
```

**Características:**
- Preview de imagen antes de guardar
- Validación de tipo (JPG, PNG, WEBP, GIF)
- Validación de tamaño (máx 5MB)
- Botón para eliminar/cambiar imagen
- Muestra imagen existente al editar

El backend debe usar **Multer** para recibir las imágenes. Ver `BACKEND-CHANGES.md` para implementación completa.

## 💀 Skeletons de Carga

Feedback visual mientras se cargan los datos:

```typescript
import { ServicioCardSkeletonGrid } from './components/ServicioCardSkeleton';

{isLoading ? (
  <ServicioCardSkeletonGrid count={6} />
) : (
  // Renderizar servicios
)}
```

Los skeletons tienen la misma estructura que los cards reales para una transición suave.

## 🧪 Datos de Prueba

```sql
-- Insertar servicios de prueba con categorías
INSERT INTO servicios (nombre, descripcion, precio_base, categoria, duracion_estimada_minutos, activo)
VALUES 
  ('Mantenimiento de PC', 'Limpieza física y optimización de software', 45.00, 'Soporte Técnico', 120, true),
  ('Configuración de Redes', 'Instalación y configuración de WiFi seguro', 60.50, 'Redes', 180, true),
  ('Desarrollo Web Full Stack', 'Aplicaciones web con React y Node.js', 2500.00, 'Desarrollo', 480, true),
  ('Consultoría DevOps', 'Optimización de pipelines CI/CD', 3000.00, 'Consultoría', 360, true),
  ('Diseño UI/UX', 'Interfaces modernas y responsivas', 1200.00, 'Diseño', 240, true),
  ('Soporte 24/7', 'Mantenimiento y soporte técnico continuo', 800.00, 'Soporte Técnico', 60, true);

-- Crear usuario de prueba (usar bcrypt para el hash real)
INSERT INTO usuarios (nombre, email, telefono, rol, contrasena_hash, activo)
VALUES 
  ('Admin Test', 'admin@test.com', '555-1234', 'admin', '$2a$12$...hash_real...', true);
```

## 🛠️ Próximos Pasos

1. ✅ Configurar variables de entorno (`.env`)
2. ✅ **Implementar cambios del backend** según `BACKEND-CHANGES.md` (IMPORTANTE)
3. ✅ Instalar Multer en el backend
4. ✅ Configurar CORS en el backend
5. ✅ Agregar campos `categoria` e `imagen_url` a la tabla `servicios`
6. ✅ Insertar datos de prueba con categorías
7. ✅ Probar login, CRUD y upload de imágenes
8. 🔄 Añadir gestión de solicitudes de servicio (opcional)
9. 🔄 Implementar roles y permisos (opcional)

## 📝 Notas Importantes

- Este es el cliente frontend solamente
- Requiere un backend con PostgreSQL y Multer
- **Ver `BACKEND-CHANGES.md`** para implementar upload de imágenes en el backend
- Ver `INTEGRATION.md` para requisitos generales del backend
- El sistema NO implementa roles en esta versión (todos los usuarios tienen acceso completo)
- Usa borrado lógico (campo `activo`) para servicios
- Las imágenes se suben usando FormData en lugar de JSON
- El backend debe servir archivos estáticos desde `/uploads`

## 📋 Archivos de Documentación

- **`BACKEND-CHANGES.md`** ← Guía completa para implementar las nuevas características en el backend
- **`INTEGRATION.md`** ← Guía general de integración
- **`README.md`** ← Este archivo (documentación del frontend)
- **`.env.example`** ← Variables de entorno necesarias
