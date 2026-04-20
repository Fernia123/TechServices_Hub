-- ==============================================================
-- TechServices Hub - Script para Aiven.io, PlanetScale o Railway
-- ==============================================================
-- NOTA: Estos servidores Cloud modernos ya te dan una base de datos 
-- (frecuentemente llamada `defaultdb`). Por lo tanto, no usamos 
-- CREATE DATABASE, solo creamos y usamos las tablas directamente.

-- 1. Tabla de Usuarios (Soporte técnico, clientes, admins)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    rol ENUM('cliente', 'tecnico', 'admin') NOT NULL DEFAULT 'cliente',
    contrasena_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Nueva Tabla de Categorías (Relación 1:N)
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabla de Servicios (Con Soft Delete relacional e Imagen)
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT, -- FOREIGN KEY (1:N)
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    imagen VARCHAR(255), -- Nuevo: URL o nombre del archivo de la imagen subida
    deleted_at TIMESTAMP NULL DEFAULT NULL, -- Reemplazo lógico a "activo" (Paranoid)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_categoria_servicio 
        FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- Fin del script Aiven. MySQL Cloud está listo para funcionar de inmediato.
