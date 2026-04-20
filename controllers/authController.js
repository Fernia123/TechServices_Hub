const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { generateTokens, verifyToken } = require('../utils/jwt');

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
const register = async (req, res) => {
  try {
    const { nombre, email, password, telefono, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verifica email duplicado
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
    }

    const contrasena_hash = await bcrypt.hash(password, 12);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      telefono,
      rol: rol || 'cliente',
      contrasena_hash
    });

    const { accessToken, refreshToken } = generateTokens(nuevoUsuario);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token: accessToken,
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error('[AUTH] Error en registro:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * POST /api/auth/login
 * Inicio de sesión
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = await Usuario.findOne({ where: { email, activo: true } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, user.contrasena_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Login exitoso',
      token: accessToken,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error('[AUTH] Error en login:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * POST /api/auth/refresh
 * Renueva el access token usando el refresh token de la cookie
 */
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token requerido' });
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await Usuario.findOne({ where: { id: decoded.id, activo: true } });

    if (!user) {
      return res.status(403).json({ error: 'Usuario inactivo o no encontrado' });
    }

    const { accessToken, refreshToken: nuevoRefreshToken } = generateTokens(user);

    res.cookie('refreshToken', nuevoRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ token: accessToken });
  } catch (err) {
    res.clearCookie('refreshToken');
    return res.status(403).json({ error: 'Refresh token inválido o expirado' });
  }
};

/**
 * POST /api/auth/logout
 * Cierre de sesión
 */
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ message: 'Sesión cerrada correctamente' });
};

module.exports = { register, login, refresh, logout };
