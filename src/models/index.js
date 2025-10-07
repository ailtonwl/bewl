const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Produto = require('./produto')(sequelize, DataTypes);
db.Unidade = require('./unidade')(sequelize, DataTypes);
db.Pessoa = require('./pessoa')(sequelize, DataTypes);
db.Compra = require('./compra')(sequelize, DataTypes);
db.ItemCompra = require('./itemcompra')(sequelize, DataTypes);
db.Venda = require('./venda')(sequelize, DataTypes);
db.ItemVenda = require('./itemvenda')(sequelize, DataTypes);
db.Recebimento = require('./recebimento')(sequelize, DataTypes);
db.ReajEstoque = require('./reajestoque')(sequelize, DataTypes);
db.ItemReajEstoque = require('./itemreajestoque')(sequelize, DataTypes);

// Aplica as associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
