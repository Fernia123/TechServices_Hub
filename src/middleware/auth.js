const { verifyToken } = require('../utils/jwt');
const { Usuario } = require('../models'); // Ajusta según tu estructura

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    // ✅ Validar contra BD (usuario activo, no eliminado, rol válido)
    const user = await Usuario.findOne({
      where: { id: decoded.id, activo: true },
      paranoid: false // Si usas soft delete, verifica manualmente o ajusta según tu setup
    });

    if (!user) return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });

    req.user = decoded; // { id, rol, email }
    req.fullUser = user; // Instancia completa de Sequelize si la necesitas
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expirado' });
    if (err.name === 'JsonWebTokenError') return res.status(403).json({ error: 'Token inválido' });
    return res.status(500).json({ error: 'Error de autenticación' });
  }
};

// Middleware para roles específicos
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para esta acción' });
  }
  next();
};

module.exports = { authenticate, authorize };