const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const ReajEstoque = sequelize.define('ReajEstoque', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dtemissao: {
      type: DataTypes.DATE, // DATA SOMENTE
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(50), // Define o tamanho máximo do campo nome como 50 caracteres
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  return ReajEstoque;
}
