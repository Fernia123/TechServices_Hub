require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { sequelize } = require('./models');

// ── Rutas ──────────────────────────────────────────
const authRoutes     = require('./routes/auth');
const servicesRoutes = require('./routes/services');

const app = express();

// ── Middlewares globales ───────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true   // Permite envío de cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Directorio Estático para Imágenes (Multer) ─────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Rutas de la API ────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a TechServices Hub API', version: '1.0.0' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/services', servicesRoutes);

// ── Health check ───────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Ruta 404 ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// ── Manejador global de errores ───────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Conexión a DB e inicio del servidor ───────────
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida.');

    // sync({ alter: true }) actualiza tablas existentes sin borrar datos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 API disponible en http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos:', err.message);
    process.exit(1);
  }
})();
// TODO: nodemon restart trigger
