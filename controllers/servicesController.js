const { Op } = require('sequelize');
const { Servicio } = require('../models');

/**
 * GET /api/services
 * Obtiene todos los servicios activos. Soporta ?search= para búsqueda
 */
const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const where = { activo: true };

    if (search) {
      where[Op.or] = [
        { nombre:    { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } },
        { categoria: { [Op.like]: `%${search}%` } }
      ];
    }

    const servicios = await Servicio.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    // Mapear a formato esperado por el frontend
    const data = servicios.map(formatService);
    return res.json(data);
  } catch (err) {
    console.error('[SERVICES] Error en getAll:', err.message);
    return res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

/**
 * GET /api/services/:id
 * Obtiene un servicio por ID
 */
const getById = async (req, res) => {
  try {
    const servicio = await Servicio.findOne({
      where: { id: req.params.id, activo: true }
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    return res.json(formatService(servicio));
  } catch (err) {
    console.error('[SERVICES] Error en getById:', err.message);
    return res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

/**
 * POST /api/services
 * Crea un nuevo servicio. Valida nombre duplicado con Sequelize.
 */
const create = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
    }

    // Validación de nombre duplicado explícita
    const existente = await Servicio.findOne({
      where: { nombre: name.trim(), activo: true }
    });
    if (existente) {
      return res.status(409).json({ error: `Ya existe un servicio con el nombre "${name}"` });
    }

    const nuevo = await Servicio.create({
      nombre:    name.trim(),
      descripcion: description || '',
      precio:    price,
      categoria: category.trim()
    });

    return res.status(201).json({
      message: 'Servicio creado correctamente',
      service: formatService(nuevo)
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Ya existe un servicio con ese nombre' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error('[SERVICES] Error en create:', err.message);
    return res.status(500).json({ error: 'Error al crear el servicio' });
  }
};

/**
 * PUT /api/services/:id
 * Actualiza un servicio existente
 */
const update = async (req, res) => {
  try {
    const servicio = await Servicio.findOne({
      where: { id: req.params.id, activo: true }
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const { name, description, price, category } = req.body;

    // Validar nombre duplicado sólo si se está cambiando el nombre
    if (name && name.trim() !== servicio.nombre) {
      const duplicado = await Servicio.findOne({
        where: { nombre: name.trim(), activo: true }
      });
      if (duplicado) {
        return res.status(409).json({ error: `Ya existe un servicio con el nombre "${name}"` });
      }
    }

    await servicio.update({
      nombre:      name      ? name.trim()      : servicio.nombre,
      descripcion: description !== undefined ? description : servicio.descripcion,
      precio:      price     !== undefined ? price         : servicio.precio,
      categoria:   category  ? category.trim()  : servicio.categoria
    });

    return res.json({
      message: 'Servicio actualizado correctamente',
      service: formatService(servicio)
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Ya existe un servicio con ese nombre' });
    }
    if (err.name === 'SequelizeValidationError') {
      return res.status(422).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error('[SERVICES] Error en update:', err.message);
    return res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

/**
 * DELETE /api/services/:id
 * Soft-delete: marca el servicio como inactivo
 */
const remove = async (req, res) => {
  try {
    const servicio = await Servicio.findOne({
      where: { id: req.params.id, activo: true }
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    await servicio.update({ activo: false });

    return res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) {
    console.error('[SERVICES] Error en delete:', err.message);
    return res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};

/**
 * Helper: normaliza modelo Sequelize al formato esperado por el frontend
 */
const formatService = (s) => ({
  id:          s.id,
  name:        s.nombre,
  description: s.descripcion || '',
  price:       parseFloat(s.precio),
  category:    s.categoria,
  activo:      s.activo,
  createdAt:   s.created_at
});

module.exports = { getAll, getById, create, update, remove };
