# TechServices Hub 🖥️

Sistema de Gestión de Servicios Tecnológicos — Proyecto Full Stack (CRUD completo).

## 👥 Integrantes del Grupo

| Nombre | Rol | GitHub |
|--------|-----|--------|
| Alumno A | Frontend Engineer (React/Vite) | [@alumno-a](https://github.com/) |
| Alumno B | Backend Engineer (Node/Express) | [@alumno-b](https://github.com/) |
| Alumno C | DB & Security Engineer (Sequelize) | [@alumno-c](https://github.com/) |

---

## 📁 Estructura del Proyecto

```
TechServices_Hub/
├── client/                  # Frontend (React + Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.tsx        # Pantalla de login con JWT
│   │   │   └── Dashboard.tsx    # CRUD de servicios + buscador en tiempo real
│   │   ├── services/
│   │   │   ├── auth.service.ts      # Llamadas a /api/auth
│   │   │   └── techServices.services.ts  # Llamadas a /api/services
│   │   ├── store/
│   │   │   └── backend.response.ts  # Tipos TypeScript compartidos
│   │   ├── App.tsx              # Enrutado Login ↔ Dashboard por token
│   │   └── main.tsx
│   └── package.json
│
└── server/                  # Backend (Node.js + Express + Sequelize)
    ├── config/
    │   └── database.js          # Conexión Sequelize (MySQL)
    ├── models/
    │   ├── index.js             # Inicializa modelos y asociaciones
    │   ├── Usuario.js           # Modelo de usuarios
    │   └── Servicio.js          # Modelo de servicios (nombre único)
    ├── controllers/
    │   ├── authController.js    # Lógica: register, login, refresh, logout
    │   └── servicesController.js # Lógica CRUD + validación de duplicados
    ├── middleware/
    │   └── auth.js              # JWT authenticate + authorize por rol
    ├── routes/
    │   ├── auth.js              # POST /api/auth/...
    │   └── services.js          # GET/POST/PUT/DELETE /api/services
    ├── utils/
    │   └── jwt.js               # generateTokens / verifyToken
    ├── app.js                   # Entry point Express
    ├── .env.example             # Plantilla de variables de entorno
    └── package.json
```

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/TechServices_Hub.git
cd TechServices_Hub
```

### 2. Configurar el Backend
```bash
cd server
cp .env.example .env
# Edita .env con tus credenciales de MySQL
npm install
```

### 3. Configurar la Base de Datos (MySQL/MariaDB)
```sql
CREATE DATABASE techservices_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
> Sequelize creará las tablas automáticamente con `sync({ alter: true })` al iniciar.

### 4. Configurar el Frontend
```bash
cd client
npm install
```

---

## 🚀 Ejecución

**Terminal 1 – Backend:**
```bash
cd server
npm run dev       # nodemon (desarrollo)
# o
npm start         # node (producción)
```
> Servidor en: `http://localhost:3000`

**Terminal 2 – Frontend:**
```bash
cd client
npm run dev
```
> App en: `http://localhost:5173`

---

## 🔌 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión → retorna JWT |
| POST | `/api/auth/refresh` | Renovar access token (cookie) |
| POST | `/api/auth/logout` | Cerrar sesión |

### Servicios (requieren Bearer token)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/services` | Listar todos los servicios |
| GET | `/api/services/:id` | Obtener uno por ID |
| POST | `/api/services` | Crear nuevo (valida nombre único) |
| PUT | `/api/services/:id` | Actualizar |
| DELETE | `/api/services/:id` | Eliminar (soft-delete) |

---

## ✅ Funcionalidades Implementadas

- [x] **CRUD completo** de Servicios (Crear, Leer, Actualizar, Eliminar)
- [x] **Validación de nombres duplicados** (a nivel Sequelize + controller)
- [x] **Buscador en tiempo real** que filtra por nombre, categoría y descripción
- [x] **Autenticación JWT** con Access Token + Refresh Token (cookie httpOnly)
- [x] **Mensajes de error claros** del backend mostrados en el frontend
- [x] **Arquitectura en capas**: config → models → controllers → routes → app
- [x] **Soft-delete** (los servicios eliminados se marcan `activo=false`)

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express, Sequelize ORM |
| Base de datos | MySQL / MariaDB |
| Autenticación | JWT (jsonwebtoken), bcryptjs |
| Estilos | Tailwind CSS + Font Awesome |

---

## 🌿 Flujo de Ramas (GitHub Flow)

```
main
 ├── feature/frontend-ui    (Alumno A)
 ├── feature/backend-api    (Alumno B)
 └── feature/db-auth        (Alumno C)
```

Cada funcionalidad se desarrolla en su rama y se integra a `main` mediante **Pull Request** con al menos una revisión aprobada.
