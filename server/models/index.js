const sequelize = require('../config/database');
const Usuario = require('./Usuario')(sequelize);
const Servicio = require('./Servicio')(sequelize);

const Categoria = require('./Categoria')(sequelize);

// === ASOCIACIONES ===
Categoria.hasMany(Servicio, { foreignKey: 'categoria_id', as: 'servicios' });
Servicio.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoriaDetalle' });

module.exports = { sequelize, Usuario, Servicio, Categoria };
