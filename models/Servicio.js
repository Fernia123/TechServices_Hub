const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Servicio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Ya existe un servicio con ese nombre' },
      validate: { notEmpty: { msg: 'El nombre del servicio no puede estar vacío' } }
    },
    descripcion: {
      type: DataTypes.TEXT
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'El precio no puede ser negativo' },
        isDecimal: { msg: 'El precio debe ser un número válido' }
      }
    },
    categoria: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: 'General'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'servicios',
    timestamps: true,
    underscored: true
  });
};
