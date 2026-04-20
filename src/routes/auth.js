const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { generateTokens, verifyToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 🟢 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

    const user = await Usuario.findOne({ where: { email, activo: true } });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const validPass = await bcrypt.compare(password, user.contrasena_hash);
    if (!validPass) return res.status(401).json({ error: 'Credenciales inválidas' });

    const { accessToken, refreshToken } = generateTokens(user);

    // 🍪 Guardar refresh token en cookie segura (recomendado para web)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en prod
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({ message: 'Login exitoso', accessToken });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// 🔄 REFRESH TOKEN
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token requerido' });

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await Usuario.findByPk(decoded.id);
    if (!user?.activo) return res.status(403).json({ error: 'Usuario inactivo' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err) {
    res.clearCookie('refreshToken');
    res.status(403).json({ error: 'Refresh token inválido o expirado' });
  }
});

// 🚪 LOGOUT
router.post('/logout', authenticate, (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;