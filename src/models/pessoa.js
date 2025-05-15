const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pessoa = sequelize.define('Pessoa', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100), // Define o tamanho máximo do campo nome como 100 caracteres
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150), // Limite de 150 caracteres
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Valida formato de e-mail
    }
  },
  cliente: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  fornecedor: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Liberado', 'Bloqueado', 'Em Débito'),
    allowNull: false
  }
},
  {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
  }
);

module.exports = Pessoa;
