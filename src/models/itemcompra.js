// src/models/itemcompra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const ItemCompra = sequelize.define('ItemCompra', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantidade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    vrunit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'Produto',
        key: 'id',
      },
    },
    compraId: {
      type: DataTypes.INTEGER,

      references: {
        model: 'Compra',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  ItemCompra.associate = (models) => {
    ItemCompra.belongsTo(models.Produto, {
      foreignKey: 'produtoId',
      as: 'produto'
    });
    ItemCompra.belongsTo(models.Compra, {
      foreignKey: 'compraId',
      as: 'compra'
    });
  };

  return ItemCompra;
}
