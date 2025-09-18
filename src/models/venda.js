const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Venda = sequelize.define('Venda', {
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
    status: {
      type: DataTypes.ENUM('Aberto', 'Recebido', 'Parcial'),
      allowNull: false
    },
    vrrecebido: {
      type: DataTypes.FLOAT,
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

  Venda.associate = (models) => {
    Venda.belongsTo(models.Pessoa, {
      foreignKey: 'pessoaId',
      as: 'pessoa'
    });
  };

  Venda.associate = (models) => {
    Venda.belongsTo(models.Pessoa, {
      foreignKey: 'pessoaId',
      as: 'pessoa'
    });
    Venda.hasMany(models.ItemVenda, {
      foreignKey: 'vendaId',
      as: 'itemVenda'
    });
  };
  return Venda;
}
