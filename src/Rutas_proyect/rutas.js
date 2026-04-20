const { authenticate, authorize } = require('./middleware/auth');
const router = require('express').Router();

// ✅ Solo usuarios autenticados
router.get('/mis-solicitudes', authenticate, async (req, res) => {
  const solicitudes = await req.fullUser.getSolicitudes();
  res.json(solicitudes);
});

// ✅ Solo administradores
router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Panel de administrador' });
});