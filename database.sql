-- =============================================
-- TechServices Hub - Script de Base de Datos
-- =============================================

-- 1. Crear la base de datos (Ejecuta esto primero)
CREATE DATABASE IF NOT EXISTS techservices_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techservices_hub;

-- 2. Tabla de Usuarios
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

-- 3. Tabla de Servicios (con validación de nombre único)
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(80) NOT NULL DEFAULT 'General',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Inserción de ejemplo (Opcional)
-- Usuario admin (password: admin123) - Necesitarías el hash de bcrypt para que funcione el login
-- Por ahora es mejor crearlos desde la app o un script de Node.
