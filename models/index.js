const sequelize = require('../config/database');
const Usuario = require('./Usuario')(sequelize);
const Servicio = require('./Servicio')(sequelize);

// === ASOCIACIONES ===
// (Aquí se pueden añadir asociaciones futuras)

module.exports = { sequelize, Usuario, Servicio };
