const t = await sequelize.transaction();
try {
  const solicitud = await Solicitud.findByPk(101, { transaction: t });
  if (!solicitud) throw new Error('Solicitud no existe');

  const estadoAnterior = solicitud.estado;
  await solicitud.update({ estado: 'en_proceso' }, { transaction: t });

  await Historial.create({
    solicitud_id: 101,
    estado_anterior: estadoAnterior,
    estado_nuevo: 'en_proceso',
    usuario_modificador_id: 8,
    observacion: 'Técnico en camino'
  }, { transaction: t });

  await t.commit();
} catch (err) {
  await t.rollback();
  throw err;
}