// src/models/compra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Compra = sequelize.define('Compra', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
    dtemissao: {
      type: DataTypes.DATE, // DATA SOMENTE
      allowNull: false,
    },
    nrdocumento: {
      type: DataTypes.STRING(15), // Define o tamanho máximo do campo nome como 15 caracteres
      allowNull: false,
    },
    vrtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    pessoaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pessoa',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  Compra.associate = (models) => {
    Compra.belongsTo(models.Pessoa, {
      foreignKey: 'pessoaId',
      as: 'pessoa'
    });
    Compra.hasMany(models.ItemCompra, {
      foreignKey: 'compraId',
      as: 'itemCompra'
    });
  };
  return Compra;
}
