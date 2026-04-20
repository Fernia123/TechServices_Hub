-- 1. USUARIOS
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

-- 2. SERVICIOS
CREATE TABLE servicios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10,2) NOT NULL CHECK (precio_base >= 0),
    duracion_estimada_minutos INT CHECK (duracion_estimada_minutos > 0),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SOLICITUDES (TICKETS)
CREATE TABLE solicitudes_servicio (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    servicio_id INT NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
    descripcion_detalle TEXT,
    fecha_solicitada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_programada TIMESTAMP,
    fecha_completada TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
    prioridad VARCHAR(10) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
    direccion TEXT,
    eliminado BOOLEAN DEFAULT FALSE, -- Soft delete
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ASIGNACIONES TÉCNICO <-> SOLICITUD
CREATE TABLE asignaciones (
    id SERIAL PRIMARY KEY,
    solicitud_id INT NOT NULL REFERENCES solicitudes_servicio(id) ON DELETE CASCADE,
    tecnico_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_asignacion VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_asignacion IN ('pendiente', 'aceptada', 'rechazada', 'completada')),
    UNIQUE(solicitud_id, tecnico_id)
);

-- 5. HISTORIAL DE ESTADOS (AUDITORÍA)
CREATE TABLE historial_estados (
    id SERIAL PRIMARY KEY,
    solicitud_id INT NOT NULL REFERENCES solicitudes_servicio(id) ON DELETE CASCADE,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20) NOT NULL,
    usuario_modificador_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacion TEXT
);

-- ÍNDICES PARA RENDIMIENTO
CREATE INDEX idx_solicitudes_usuario ON solicitudes_servicio(usuario_id);
CREATE INDEX idx_solicitudes_servicio ON solicitudes_servicio(servicio_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes_servicio(estado);
CREATE INDEX idx_asignaciones_tecnico ON asignaciones(tecnico_id);
CREATE INDEX idx_historial_solicitud ON historial_estados(solicitud_id);