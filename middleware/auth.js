const { verifyToken } = require('../utils/jwt');
const { Usuario } = require('../models');

/**
 * Middleware de autenticación - verifica JWT en el header Authorization
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, process.env.JWT_SECRET);

    // Validar que el usuario sigue activo en BD
    const user = await Usuario.findOne({
      where: { id: decoded.id, activo: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' });
    }

    req.user = decoded;       // { id, rol, email, nombre }
    req.fullUser = user;      // Instancia completa de Sequelize
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Por favor inicia sesión de nuevo' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' });
    }
    return res.status(500).json({ error: 'Error de autenticación' });
  }
};

/**
 * Middleware de autorización por rol
 * Uso: authorize('admin') o authorize('admin', 'tecnico')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({
      error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`
    });
  }
  next();
};

module.exports = { authenticate, authorize };
