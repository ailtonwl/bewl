const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const ItemVenda = sequelize.define('ItemVenda', {
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
    vendaId: {
      type: DataTypes.INTEGER,

      references: {
        model: 'Venda',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  ItemVenda.associate = (models) => {
    ItemVenda.belongsTo(models.Produto, {
      foreignKey: 'produtoId',
      as: 'produto'
    });
    ItemVenda.belongsTo(models.Venda, {
      foreignKey: 'vendaId',
      as: 'venda'
    });

  };

  return ItemVenda;
}
