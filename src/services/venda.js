// src/services/venda.js
const { Venda, ItemVenda, Produto, Unidade, Pessoa, sequelize } = require('../models');
const { diminuirEstoque, aumentarEstoque } = require('./stock');
// const { Pessoa } = require('../models');
// const { ItemVenda } = require('../models');
// const { Produto } = require('../models');
// const { Unidade } = require('../models');

export const listVendas = async (req, res) => {
  const vendas = await Venda.findAll({
    attributes: ['id', 'dtemissao', 'nrdocumento', 'vrtotal', 'ativo', 'status', 'vrrecebido', 'pessoaId'],
    include: [
      {
        model: Pessoa,
        as: 'pessoa',
        attributes: ['id', 'nome']
      },
      {
        model: ItemVenda,
        as: 'itemVenda',
        attributes: ['id', 'quantidade', 'vrunit', 'ativo', 'produtoId', 'vendaId'],
        include: {
          model: Produto,
          as: 'produto',
          attributes: ['id', 'descricao'],
          include: {
            model: Unidade,
            as: 'unidade',
            attributes: ['sigla']
          }
        }
      }
    ],
    order: [['dtemissao', 'DESC']]
  });
  return vendas;
};

// export const createVenda = async (venda) => {
//   const createdVenda = await Venda.create(venda)
//   await venda.itemVenda.map((item) => {
//     item.vendaId = createdVenda.id
//     ItemVenda.create(item)
//   })
//   return createdVenda
// }

exports.createVenda = async (venda) => {
  return await sequelize.transaction(async (t) => {
    const createdVenda = await Venda.create(venda, { transaction: t });

    // insere itens e diminui estoque para cada item
    const itens = venda.itemVenda || [];
    for (const item of itens) {
      item.vendaId = createdVenda.id;
      await ItemVenda.create(item, { transaction: t });
      await diminuirEstoque(item.produtoId, item.quantidade, t);
    }

    return createdVenda;
  });
};

exports.updateVenda = async (id, req, res) => {
  const dados = req.body;

  return await sequelize.transaction(async (t) => {
    // Atualiza os dados da venda
    await Venda.update({
      dtemissao: dados.dtemissao,
      nrdocumento: dados.nrdocumento,
      pessoaId: dados.pessoaId,
      vrtotal: dados.vrtotal,
      vrrecebido: dados.vrrecebido,
      status: dados.status,
      ativo: dados.ativo
    }, { where: { id }, transaction: t });

    // Itens atuais e enviados
    const itensAtuais = await ItemVenda.findAll({ where: { vendaId: id }, transaction: t });
    const itensEnviados = dados.itemVenda?.filter(item => !item._excluir) || [];
    const idsEnviados = itensEnviados.map(item => item.id).filter(Boolean);
    const idsAtuais = itensAtuais.map(item => item.id);

    // Itens a excluir (foram removidos no front)
    const idsParaExcluir = idsAtuais.filter(x => !idsEnviados.includes(x));

    // Para cada item removido: devolver estoque
    for (const idExcluir of idsParaExcluir) {
      const item = itensAtuais.find(i => i.id === idExcluir);
      if (item) {
        await aumentarEstoque(item.produtoId, item.quantidade, t);
        await ItemVenda.destroy({ where: { id: idExcluir }, transaction: t });
      }
    }

    // Atualizar existentes e criar novos, ajustando estoque conforme diferença
    for (const item of itensEnviados) {
      if (item.id && idsAtuais.includes(item.id)) {
        // item existente
        const itemAntigo = itensAtuais.find(i => i.id === item.id);
        const qtdAntiga = itemAntigo.quantidade;
        const qtdNova = item.quantidade;

        if (qtdNova !== qtdAntiga || item.produtoId !== itemAntigo.produtoId) {
          // Se produto mudou: devolver estoque do antigo, diminuir do novo
          if (item.produtoId !== itemAntigo.produtoId) {
            await aumentarEstoque(itemAntigo.produtoId, qtdAntiga, t);
            await diminuirEstoque(item.produtoId, qtdNova, t);
          } else {
            const diff = qtdNova - qtdAntiga;
            if (diff > 0) {
              await diminuirEstoque(item.produtoId, diff, t);
            } else if (diff < 0) {
              await aumentarEstoque(item.produtoId, -diff, t);
            }
          }
        }

        await ItemVenda.update({
          quantidade: item.quantidade,
          vrunit: item.vrunit,
          ativo: item.ativo,
          produtoId: item.produtoId,
          descricao: item.descricao
        }, { where: { id: item.id }, transaction: t });

      } else {
        // novo item
        const novo = await ItemVenda.create({
          vendaId: id,
          quantidade: item.quantidade,
          vrunit: item.vrunit,
          ativo: item.ativo ?? true,
          produtoId: item.produtoId,
          descricao: item.descricao
        }, { transaction: t });
        await diminuirEstoque(item.produtoId, item.quantidade, t);
      }
    }

    // Retorna venda atualizada com inclusões
    const vendaAtualizada = await Venda.findOne({
      where: { id },
      include: [
        { model: Pessoa, as: 'pessoa', attributes: ['id', 'nome'] },
        {
          model: ItemVenda,
          as: 'itemVenda',
          include: {
            model: Produto,
            as: 'produto',
            include: { model: require('../models').Unidade, as: 'unidade' }
          }
        }
      ],
      transaction: t
    });

    return vendaAtualizada;
  });
};

export const updateVendaRec = async (id, req, res) => {
  const dados = req.body;

  console.log('Estou aqui atualizando vendaRec', 'dados: ', dados);

  const vrRecebido = dados.vrRecAnterior + dados.vrrecebido;
  const statusRec = (vrRecebido < dados.vendaTotal) ? 'Parcial' : 'Recebido';
  await Venda.update({
    vrrecebido: vrRecebido,
    status: statusRec
  }, { where: { id } });
  return true
}

export const buscaVenda = async (id) => {
  const venda = await Venda.findOne({
    where: { id },
  })
  return venda
}

exports.deleteVenda = async (id) => {
  return await sequelize.transaction(async (t) => {
    const itens = await ItemVenda.findAll({ where: { vendaId: id }, transaction: t });

    for (const item of itens) {
      await aumentarEstoque(item.produtoId, item.quantidade, t);
    }

    await ItemVenda.destroy({ where: { vendaId: id }, transaction: t });
    await Venda.destroy({ where: { id }, transaction: t });
  });
};
