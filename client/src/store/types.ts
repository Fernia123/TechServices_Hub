// Interfaces basadas en el esquema de la base de datos PostgreSQL

export type RolUsuario = 'cliente' | 'tecnico' | 'admin';

export type EstadoSolicitud = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

export type PrioridadSolicitud = 'baja' | 'media' | 'alta';

export type EstadoAsignacion = 'pendiente' | 'aceptada' | 'rechazada' | 'completada';

// TABLA: usuarios
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  rol: RolUsuario;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}

// TABLA: servicios
export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  categoria: string;
  duracion_estimada_minutos?: number;
  imagen_url?: string; // URL de la imagen del servicio
  activo: boolean;
  creado_en: string;
}

// TABLA: solicitudes_servicio
export interface SolicitudServicio {
  id: number;
  usuario_id: number;
  servicio_id: number;
  descripcion_detalle?: string;
  fecha_solicitada: string;
  fecha_programada?: string;
  fecha_completada?: string;
  estado: EstadoSolicitud;
  prioridad: PrioridadSolicitud;
  direccion?: string;
  eliminado: boolean;
  creado_en: string;
  actualizado_en: string;
  // Relaciones populadas (opcional)
  cliente?: Usuario;
  servicio?: Servicio;
  tecnicosAsignados?: Usuario[];
  historial?: HistorialEstado[];
}

// TABLA: asignaciones
export interface Asignacion {
  id: number;
  solicitud_id: number;
  tecnico_id: number;
  fecha_asignacion: string;
  estado_asignacion: EstadoAsignacion;
  // Relaciones
  tecnico?: Usuario;
  solicitud?: SolicitudServicio;
}

// TABLA: historial_estados
export interface HistorialEstado {
  id: number;
  solicitud_id: number;
  estado_anterior?: EstadoSolicitud;
  estado_nuevo: EstadoSolicitud;
  usuario_modificador_id?: number;
  fecha_cambio: string;
  observacion?: string;
  // Relaciones
  modificador?: Usuario;
}

// DTOs para crear/actualizar

export interface CrearServicioDTO {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  categoria: string;
  duracion_estimada_minutos?: number;
  activo?: boolean;
  imagen?: File; // Archivo de imagen para upload
}

export interface ActualizarServicioDTO {
  nombre?: string;
  descripcion?: string;
  precio_base?: number;
  categoria?: string;
  duracion_estimada_minutos?: number;
  activo?: boolean;
  imagen?: File; // Archivo de imagen para upload
}

export interface CrearSolicitudDTO {
  usuario_id: number;
  servicio_id: number;
  descripcion_detalle?: string;
  fecha_programada?: string;
  prioridad?: PrioridadSolicitud;
  direccion?: string;
}

export interface ActualizarSolicitudDTO {
  descripcion_detalle?: string;
  fecha_programada?: string;
  fecha_completada?: string;
  estado?: EstadoSolicitud;
  prioridad?: PrioridadSolicitud;
  direccion?: string;
}

// Respuestas de autenticación

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user?: Usuario;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Respuesta con datos poblados para el dashboard
export interface ServicioConRelaciones extends Servicio {
  solicitudes?: SolicitudServicio[];
}

export interface SolicitudConRelaciones extends SolicitudServicio {
  cliente: Usuario;
  servicio: Servicio;
  tecnicosAsignados?: Usuario[];
  historial?: HistorialEstado[];
}
