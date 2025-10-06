// src/services/produto.js
const { Produto, Unidade } = require('../models');

export const listProdutos = async (req, res) => {
  const produtos = await Produto.findAll(
    {
      attributes: ['id', 'descricao', 'estoque', 'vrcusto', 'vrvenda', 'customedio', 'ativo', 'unidadeId'], // só os campos desejados de Produto
      include: {
        model: Unidade,
        as: 'unidade',
        attributes: ['sigla']
      },
      order: [['descricao', 'ASC']]
    }
  );
  // Transformar resultado para incluir sigla no nível principal
  return produtos.map(produto => {
    const prod = produto.toJSON(); // converte para objeto puro
    // Formato novo
    return Object.assign({}, prod, {
      sigla: prod.unidade.sigla
    });
  });
}

export const createProduto = async (produto) => {
  const createdProduto = await Produto.create(produto)
  return createdProduto
}

export const updateProduto = async (id, req, res) => {
  console.log('service: ', id, req.body)
  const updatedProduto = await Produto.update(
    req.body,
    {
      where: { id },
    },
  );
  return updateProduto
}

export const buscaProduto = async (id) => {
  const produto = await Produto.findOne({
    where: { id },
  })
  const descUnidade = await Unidade.findOne({
    where: { id: produto.unid_id }
  })
  const retProduto = {
    id: produto.id, descricao: produto.descricao, vrcusto: produto.vrcusto, vrvenda: produto.vrvenda,
    customedio: produto.customedio, estoque: produto.estoque, ativo: produto.ativo, unid_id: produto.unid_id,
    descunidade: descUnidade.descricao
  }
  return retProduto
}

export const deleteProduto = async (id) => {
  await Produto.destroy({
    where: { id }
  })
}
