// Soft delete (usa deleted_at)
await Solicitud.destroy({ where: { id: 101 } });

// Borrado físico (ignora paranoid)
await Solicitud.destroy({ where: { id: 101 }, force: true });