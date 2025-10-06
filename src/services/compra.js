// src/services/compra.js
const { Compra, ItemCompra, Produto, Unidade, Pessoa, sequelize } = require('../models');
const { diminuirEstoque, aumentarEstoque } = require('./stock');

export const listCompras = async (req, res) => {
  const compras = await Compra.findAll({
    attributes: ['id', 'dtemissao', 'nrdocumento', 'vrtotal', 'ativo', 'pessoaId'],
    include: [
      {
        model: Pessoa,
        as: 'pessoa',
        attributes: ['id', 'nome']
      },
      {
        model: ItemCompra,
        as: 'itemCompra',
        attributes: ['id', 'quantidade', 'vrunit', 'ativo', 'produtoId', 'compraId'],
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

  return compras;
};

export const createCompra = async (compra) => {
  return await sequelize.transaction(async (t) => {
    const createdCompra = await Compra.create(compra, { transaction: t });

    // insere itens e diminui estoque para cada item
    const itens = compra.itemCompra || [];
    for (const item of itens) {
      item.compraId = createdCompra.id;
      await ItemCompra.create(item, { transaction: t });
      await aumentarEstoque(item.produtoId, item.quantidade, t);
    }

    return createdCompra
  });
};

exports.updateCompra = async (id, req, res) => {
  const dados = req.body;

  return await sequelize.transaction(async (t) => {
    // Atualiza os dados da compra
    await Compra.update({
      dtemissao: dados.dtemissao,
      nrdocumento: dados.nrdocumento,
      pessoaId: dados.pessoaId,
      vrtotal: dados.vrtotal,
      ativo: dados.ativo
    }, { where: { id }, transaction: t });

    // Itens atuais e enviados
    const itensAtuais = await ItemCompra.findAll({ where: { compraId: id }, transaction: t });
    const itensEnviados = dados.itemCompra?.filter(item => !item._excluir) || [];
    const idsEnviados = itensEnviados.map(item => item.id).filter(Boolean);
    const idsAtuais = itensAtuais.map(item => item.id);

    // 🔴 Excluir itens que foram removidos
    const idsParaExcluir = idsAtuais.filter(x => !idsEnviados.includes(x));

    // Para cada item removido: devolver estoque
    for (const idExcluir of idsParaExcluir) {
      const item = itensAtuais.find(i => i.id === idExcluir);
      if (item) {
        await diminuirEstoque(item.produtoId, item.quantidade, t);
        await ItemCompra.destroy({ where: { id: idExcluir }, transaction: t });
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
            await diminuirEstoque(itemAntigo.produtoId, qtdAntiga, t);
            await aumentarEstoque(item.produtoId, qtdNova, t);
          } else {
            const diff = qtdNova - qtdAntiga;
            if (diff > 0) {
              await aumentarEstoque(item.produtoId, diff, t);
            } else if (diff < 0) {
              await aumentarEstoque(item.produtoId, -diff, t);
            }
          }
        }

        await ItemCompra.update({
          quantidade: item.quantidade,
          vrunit: item.vrunit,
          ativo: item.ativo,
          produtoId: item.produtoId,
          descricao: item.descricao
        }, { where: { id: item.id }, transaction: t });

      } else {
        // novo item
        const novo = await ItemCompra.create({
          compraId: id,
          quantidade: item.quantidade,
          vrunit: item.vrunit,
          ativo: item.ativo ?? true,
          produtoId: item.produtoId,
          descricao: item.descricao
        }, { transaction: t });
        await aumentarEstoque(item.produtoId, item.quantidade, t);
      }
    }

    // Retorna compra atualizada com inclusões
    const compraAtualizada = await Compra.findOne({
      where: { id },
      include: [
        { model: Pessoa, as: 'pessoa', attributes: ['id', 'nome'] },
        {
          model: ItemCompra,
          as: 'itemCompra',
          include: {
            model: Produto,
            as: 'produto',
            include: { model: require('../models').Unidade, as: 'unidade' }
          }
        }
      ],
      transaction: t
    });

    return compraAtualizada;
  });
};

export const buscaCompra = async (id) => {
  const compra = await Compra.findOne({
    where: { id },
    attributes: ['id', 'dtemissao', 'nrdocumento', 'vrtotal', 'ativo', 'pessoaId'],
    include: [
      {
        model: Pessoa,
        as: 'pessoa',
        attributes: ['id', 'nome']
      }
    ]
  })
  return compra
}

export const deleteCompra = async (id) => {

  await Compra.destroy({
    where: { id }
  })
}

