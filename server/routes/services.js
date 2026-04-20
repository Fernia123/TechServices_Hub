const router = require('express').Router();
const { getAll, getById, create, update, remove } = require('../controllers/servicesController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET    /api/services        - Lista todos (público o autenticado según necesidad)
router.get('/',     authenticate, getAll);

// GET    /api/services/:id    - Obtiene uno por ID
router.get('/:id',  authenticate, getById);

// POST   /api/services        - Crea nuevo servicio
router.post('/',    authenticate, upload.single('imagen'), create);

// PUT    /api/services/:id    - Actualiza servicio
router.put('/:id',  authenticate, upload.single('imagen'), update);

// DELETE /api/services/:id    - Elimina (soft delete)
router.delete('/:id', authenticate, remove);

module.exports = router;
