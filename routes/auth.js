const router = require('express').Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/refresh  (usa cookie httpOnly)
router.post('/refresh', refresh);

// POST /api/auth/logout   (requiere token válido)
router.post('/logout', authenticate, logout);

module.exports = router;
