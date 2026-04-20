const jwt = require('jsonwebtoken');

/**
 * Genera access token y refresh token para el usuario
 */
const generateTokens = (user) => {
  const payload = { id: user.id, rol: user.rol, email: user.email, nombre: user.nombre };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

/**
 * Verifica y decodifica un token JWT
 */
const verifyToken = (token, secret) => jwt.verify(token, secret);

module.exports = { generateTokens, verifyToken };
