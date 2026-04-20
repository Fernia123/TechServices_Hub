const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    telefono: { type: DataTypes.STRING(20) },
    rol: { type: DataTypes.ENUM('cliente', 'tecnico', 'admin'), allowNull: false },
    contrasena_hash: { type: DataTypes.STRING(255), allowNull: false },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'usuarios',
    timestamps: true, // createdAt, updatedAt
    underscored: true // mapea createdAt → created_at (opcional, según convención)
  });
};