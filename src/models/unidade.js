const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const Unidade = sequelize.define('Unidade', {
    sigla: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    descricao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: true,
    freezeTableName: true

  });

  Unidade.associate = (models) => {
    Unidade.hasMany(models.Produto, {
      foreignKey: 'unidadeId',
      as: 'produto'
    });
  };

  return Unidade;
};
