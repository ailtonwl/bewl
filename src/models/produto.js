const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Unidade = require('../models/unidade')

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  descricao: {
    type: DataTypes.STRING(100), // Define o tamanho máximo do campo nome como 100 caracteres
    allowNull: false
  },
  vrcusto: {
    type: DataTypes.REAL(10, 2), // 8 DIGITOS INTEIROS E 2 DIGITOS DECIMAIS
    allowNull: false,
  },
  vrvenda: {
    type: DataTypes.REAL(10, 2), // 8 DIGITOS INTEIROS E 2 DIGITOS DECIMAIS
    allowNull: false,
  },
  customedio: {
    type: DataTypes.REAL(10, 2), // 8 DIGITOS INTEIROS E 2 DIGITOS DECIMAIS
    allowNull: false,
  },
  estoque: {
    type: DataTypes.REAL(9, 3), // 6 DIGITOS INTEIROS E 3 DIGITOS DECIMAIS
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  unid_id: {
    type: DataTypes.INTEGER,

    references: {
      // This is a reference to another model
      model: Unidade,

      // This is the column name of the referenced model
      key: 'id',

      // With PostgreSQL, it is optionally possible to declare when to check the foreign key constraint, passing the Deferrable type.
      // deferrable: Deferrable.INITIALLY_IMMEDIATE,
      // Options:
      // - `Deferrable.INITIALLY_IMMEDIATE` - Immediately check the foreign key constraints
      // - `Deferrable.INITIALLY_DEFERRED` - Defer all foreign key constraint check to the end of a transaction
      // - `Deferrable.NOT` - Don't defer the checks at all (default) - This won't allow you to dynamically change the rule in a transaction
    },
  },
},
  {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
  }
);

module.exports = Produto;
