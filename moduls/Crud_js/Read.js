const tickets = await Solicitud.findAll({
  where: { usuario_id: 5, deleted_at: null }, // paranoid filtra automáticamente, pero por claridad:
  include: [
    { model: Usuario, as: 'cliente', attributes: ['nombre', 'email'] },
    { model: Servicio, as: 'servicio', attributes: ['nombre', 'precio_base'] },
    { model: Historial, as: 'historial', order: [['createdAt', 'DESC']] }
  ],
  order: [['createdAt', 'DESC']]
});