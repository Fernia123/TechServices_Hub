const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Categoria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Ya existe una categoría con ese nombre' },
      validate: { notEmpty: { msg: 'El nombre de la categoría no puede estar vacío' } }
    }
  }, {
    tableName: 'categorias',
    timestamps: true,
    underscored: true
  });
};
