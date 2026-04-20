const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const payload = { id: user.id, rol: user.rol, email: user.email };
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
  
  return { accessToken, refreshToken };
};

const verifyToken = (token, secret) => jwt.verify(token, secret);

module.exports = { generateTokens, verifyToken };