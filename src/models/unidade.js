const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unidade = sequelize.define('Unidade', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sigla: {
    type: DataTypes.STRING(5), // Define o tamanho máximo do campo nome como 5 caracteres
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING(100), // Define o tamanho máximo do campo nome como 100 caracteres
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
},
  {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
  }
);

module.exports = Unidade;
