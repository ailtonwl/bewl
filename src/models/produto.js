const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define('Produto', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    vrcusto: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    vrvenda: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    customedio: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    estoque: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    unidadeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Unidade',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    freezeTableName: true
  });

  Produto.associate = (models) => {
    Produto.belongsTo(models.Unidade, {
      foreignKey: 'unidadeId',
      as: 'unidade'
    });
    Produto.hasMany(models.ItemCompra, {
      foreignKey: 'produtoId',
      as: 'itemcompra'
    });

  };

  return Produto;
};
