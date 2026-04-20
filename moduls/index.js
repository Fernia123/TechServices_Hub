const Usuario = require('./Usuario')(sequelize);
const Servicio = require('./Servicio')(sequelize);
const Solicitud = require('./SolicitudServicio')(sequelize);
const Asignacion = require('./Asignacion')(sequelize);
const Historial = require('./HistorialEstado')(sequelize);

// 1 Usuario → N Solicitudes
Usuario.hasMany(Solicitud, { foreignKey: 'usuario_id', as: 'solicitudes' });
Solicitud.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'cliente' });

// 1 Servicio → N Solicitudes
Servicio.hasMany(Solicitud, { foreignKey: 'servicio_id', as: 'solicitudes' });
Solicitud.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });

// N Solicitudes ↔ N Técnicos (tabla intermedia `asignaciones`)
Solicitud.belongsToMany(Usuario, {
  through: Asignacion,
  foreignKey: 'solicitud_id',
  otherKey: 'tecnico_id',
  as: 'tecnicosAsignados'
});
Usuario.belongsToMany(Solicitud, {
  through: Asignacion,
  foreignKey: 'tecnico_id',
  otherKey: 'solicitud_id',
  as: 'asignaciones'
});

// 1 Solicitud → N Historiales
Solicitud.hasMany(Historial, { foreignKey: 'solicitud_id', as: 'historial' });
Historial.belongsTo(Solicitud, { foreignKey: 'solicitud_id' });
Historial.belongsTo(Usuario, { foreignKey: 'usuario_modificador_id', as: 'modificador' });