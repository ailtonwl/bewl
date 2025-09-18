const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Recebimento = sequelize.define('Recebimento', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dtrecebimento: {
      type: DataTypes.DATE, // DATA SOMENTE
      allowNull: false,
    },
    nrdocumento: {
      type: DataTypes.STRING(15), // Define o tamanho máximo do campo nome como 15 caracteres
      allowNull: false,
    },
    vrrecebido: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    vrjuros: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    vrdesconto: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    vendaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Venda',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  Recebimento.associate = (models) => {
    Recebimento.belongsTo(models.Venda, {
      foreignKey: 'vendaId',
      as: 'venda'
    });
  };
  return Recebimento;
}
