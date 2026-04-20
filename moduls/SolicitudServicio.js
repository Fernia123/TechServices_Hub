const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SolicitudServicio', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    servicio_id: { type: DataTypes.INTEGER, allowNull: false },
    descripcion_detalle: { type: DataTypes.TEXT },
    fecha_programada: { type: DataTypes.DATE },
    fecha_completada: { type: DataTypes.DATE },
    estado: { type: DataTypes.ENUM('pendiente', 'en_proceso', 'completado', 'cancelado'), defaultValue: 'pendiente' },
    prioridad: { type: DataTypes.ENUM('baja', 'media', 'alta'), defaultValue: 'media' },
    direccion: { type: DataTypes.TEXT }
  }, {
    tableName: 'solicitudes_servicio',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: (solicitud) => { solicitud.fecha_solicitada = new Date(); }
    }
  });
};
