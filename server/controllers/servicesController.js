const { Op } = require('sequelize');
const { Servicio, Categoria } = require('../models');

/**
 * GET /api/services
 * Obtiene todos los servicios activos. Soporta ?search= para búsqueda
 */
const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { nombre:    { [Op.like]: `%${search}%` } },
        { descripcion: { [Op.like]: `%${search}%` } }
        // La búsqueda por categoría en tabla relacionada requeriría joins, la limitamos a nombre/descripción.
      ];
    }

    const servicios = await Servicio.findAll({
      where,
      include: [{ model: Categoria, as: 'categoriaDetalle' }],
      order: [['created_at', 'DESC']]
    });

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
      where: { id: req.params.id },
      include: [{ model: Categoria, as: 'categoriaDetalle' }]
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
 * Crea un nuevo servicio (FormData)
 */
const create = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
    }

    // Buscar o crear la categoría
    const [categoriaBD] = await Categoria.findOrCreate({
      where: { nombre: category.trim() }
    });

    const existente = await Servicio.findOne({
      where: { nombre: name.trim() }
    });
    if (existente) {
      return res.status(409).json({ error: `Ya existe un servicio con el nombre "${name}"` });
    }

    const nuevo = await Servicio.create({
      nombre:    name.trim(),
      descripcion: description || '',
      precio:    price,
      categoria_id: categoriaBD.id,
      imagen:    req.file ? req.file.filename : null
    });

    // Cargar la relación para el frontend
    const servicioCreado = await Servicio.findByPk(nuevo.id, {
      include: [{ model: Categoria, as: 'categoriaDetalle' }]
    });

    return res.status(201).json({
      message: 'Servicio creado correctamente',
      service: formatService(servicioCreado)
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
      where: { id: req.params.id }
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    const { name, description, price, category } = req.body;

    if (name && name.trim() !== servicio.nombre) {
      const duplicado = await Servicio.findOne({
        where: { nombre: name.trim() }
      });
      if (duplicado) {
        return res.status(409).json({ error: `Ya existe un servicio con el nombre "${name}"` });
      }
    }

    let categoriaId = servicio.categoria_id;
    if (category && category.trim()) {
      const [categoriaBD] = await Categoria.findOrCreate({
        where: { nombre: category.trim() }
      });
      categoriaId = categoriaBD.id;
    }

    await servicio.update({
      nombre:      name      ? name.trim()      : servicio.nombre,
      descripcion: description !== undefined ? description : servicio.descripcion,
      precio:      price     !== undefined ? price         : servicio.precio,
      categoria_id: categoriaId,
      imagen:      req.file  ? req.file.filename : servicio.imagen
    });

    const servicioActualizado = await Servicio.findByPk(servicio.id, {
      include: [{ model: Categoria, as: 'categoriaDetalle' }]
    });

    return res.json({
      message: 'Servicio actualizado correctamente',
      service: formatService(servicioActualizado)
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
 * Soft-delete (paranoid: true)
 */
const remove = async (req, res) => {
  try {
    const servicio = await Servicio.findOne({
      where: { id: req.params.id }
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    await servicio.destroy();

    return res.json({ message: 'Servicio eliminado correctamente' });
  } catch (err) {
    console.error('[SERVICES] Error en delete:', err.message);
    return res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};

const formatService = (s) => ({
  id:          s.id,
  name:        s.nombre,
  description: s.descripcion || '',
  price:       parseFloat(s.precio),
  category:    s.categoriaDetalle ? s.categoriaDetalle.nombre : 'Sin Categoría',
  imagen:      s.imagen,
  createdAt:   s.created_at
});

module.exports = { getAll, getById, create, update, remove };
