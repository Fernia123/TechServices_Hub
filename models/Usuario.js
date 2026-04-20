const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: 'El nombre no puede estar vacío' } }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: 'El email ya está registrado' },
      validate: { isEmail: { msg: 'Formato de email inválido' } }
    },
    telefono: {
      type: DataTypes.STRING(20)
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'tecnico', 'admin'),
      allowNull: false,
      defaultValue: 'cliente'
    },
    contrasena_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    underscored: true
  });
};
