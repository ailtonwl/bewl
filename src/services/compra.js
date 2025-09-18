// src/services/compra.js
const { Compra } = require('../models');
const { Pessoa } = require('../models');
const { ItemCompra } = require('../models');
const { Produto } = require('../models');
const { Unidade } = require('../models');

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
    ]
  });

  return compras;
};

export const createCompra = async (compra) => {

  const createdCompra = await Compra.create(compra)

  await compra.itemCompra.map((item) => {
    item.compraId = createdCompra.id
    ItemCompra.create(item)
  })

  return createdCompra
}

export const updateCompra = async (id, req, res) => {
  const dados = req.body;

  // Atualiza os dados da compra
  await Compra.update(
    {
      dtemissao: dados.dtemissao,
      nrdocumento: dados.nrdocumento,
      pessoaId: dados.pessoaId,
      vrtotal: dados.vrtotal,
      ativo: dados.ativo
    },
    { where: { id } }
  );

  // Busca os itens atuais no banco
  const itensAtuais = await ItemCompra.findAll({ where: { compraId: id } });

  // Cria mapas para facilitar comparação
  const itensEnviados = dados.itemCompra || [];
  const idsEnviados = itensEnviados.map(item => item.id).filter(Boolean);
  const idsAtuais = itensAtuais.map(item => item.id);

  // 🔴 Excluir itens que foram removidos
  const idsParaExcluir = idsAtuais.filter(id => !idsEnviados.includes(id));
  await Promise.all(idsParaExcluir.map(id => ItemCompra.destroy({ where: { id } })));

  // 🔄 Atualizar ou criar itens
  for (const item of itensEnviados) {
    if (item.id && idsAtuais.includes(item.id)) {
      // Atualizar item existente
      await ItemCompra.update(
        {
          quantidade: item.quantidade,
          vrunit: item.vrunit,
          ativo: item.ativo,
          produtoId: item.produtoId,
          descricao: item.descricao
        },
        { where: { id: item.id } }
      );
    } else {
      // Criar novo item
      await ItemCompra.create({
        compraId: id,
        quantidade: item.quantidade,
        vrunit: item.vrunit,
        ativo: item.ativo ?? true,
        produtoId: item.produtoId,
        descricao: item.descricao
      });
    }
  }

  // Retorna a compra atualizada
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
          include: { model: Unidade, as: 'unidade' }
        }
      }
    ]
  });

  return compraAtualizada;
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

