const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wlvendas', 'postgres', 'root', {
  host: 'localhost',
  port: 5434,
  dialect: 'postgres',
});

module.exports = sequelize;
