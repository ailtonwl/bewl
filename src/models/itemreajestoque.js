const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const ItemReajEstoque = sequelize.define('ItemReajEstoque', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantidade: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    entrasai: {
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
    reajEstoqueId: {
      type: DataTypes.INTEGER,

      references: {
        model: 'ReajEstoque',
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  ItemReajEstoque.associate = (models) => {
    ItemReajEstoque.belongsTo(models.Produto, {
      foreignKey: 'produtoId',
      as: 'produto'
    });
    ItemReajEstoque.belongsTo(models.ReajEstoque, {
      foreignKey: 'reajEstoqueId',
      as: 'reajestoque'
    });
  };

  return ItemReajEstoque;
}
