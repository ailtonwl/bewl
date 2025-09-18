const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Produto = require('./Produto')(sequelize, DataTypes);
db.Unidade = require('./Unidade')(sequelize, DataTypes);
db.Pessoa = require('./Pessoa')(sequelize, DataTypes);
db.Compra = require('./Compra')(sequelize, DataTypes);
db.ItemCompra = require('./ItemCompra')(sequelize, DataTypes);
db.Venda = require('./Venda')(sequelize, DataTypes);
db.ItemVenda = require('./ItemVenda')(sequelize, DataTypes);
db.Recebimento = require('./Recebimento')(sequelize, DataTypes);
db.ReajEstoque = require('./ReajEstoque')(sequelize, DataTypes);
db.ItemReajEstoque = require('./ItemReajEstoque')(sequelize, DataTypes);

// Aplica as associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
