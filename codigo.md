// models/index.js

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Produto = require('./Produto')(sequelize, DataTypes);
db.Unidade = require('./Unidade')(sequelize, DataTypes);
db.Pessoa = require('./Pessoa')(sequelize, DataTypes);
db.Compra = require('./Compra')(sequelize, DataTypes);
db.ItemCompra = require('./ItemCompra')(sequelize, DataTypes);

// Aplica as associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

// models/produto.js
 
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
  };

  Produto.associate = (models) => {
    Produto.hasMany(models.ItemCompra, {
      foreignKey: 'produtoId',
      as: 'itemcompra'
    });
  };

  return Produto;
};

// models/unidade.js

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

// models/compra.js

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
  };
  return Compra;
}

// models/itemcompra.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  const ItemCompra = sequelize.define('ItemCompra', {
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
        model: Produto,
        key: 'id',
      },
    },
    compraId: {
      type: DataTypes.INTEGER,

      references: {
        model: Compra,
        key: 'id',
      },
    },
  }, {
    timestamps: true,
    freezeTableName: true
    // Adiciona createdAt e updatedAt automaticamente
  });

  ItemCompra.associate = (models) => {
    ItemCompra.belongsTo(models.Produto, {
      foreignKey: 'produtoId',
      as: 'produto'
    });
    ItemCompra.belongsTo(models.Compra, {
      foreignKey: 'compraId',
      as: 'compra'
    });
  };

  return ItemCompra;
}

// models/pessoa.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
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
      timestamps: true,
      freezeTableName: true
      // Adiciona createdAt e updatedAt automaticamente
    }
  );

  Pessoa.associate = (models) => {
    Pessoa.hasMany(models.Compra, {
      foreignKey: 'pessoaId',
      as: 'compra'
    });
  };
  return Pessoa;
}

