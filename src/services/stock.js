// src/services/stock.js
const { Produto, ItemVenda, Venda, sequelize } = require('../models');

async function lockProduto(produtoId, transaction) {
  // força SELECT ... FOR UPDATE
  const produto = await Produto.findByPk(produtoId, { transaction, lock: transaction.LOCK.UPDATE });
  if (!produto) throw new Error(`Produto ${produtoId} não encontrado`);
  return produto;
}

async function diminuirEstoque(produtoId, quantidade, transaction) {
  if (quantidade <= 0) return;
  const produto = await lockProduto(produtoId, transaction);
  if (produto.estoque < quantidade) {
    throw new Error(`Estoque insuficiente para o produto ${produtoId}`);
  }
  produto.estoque = produto.estoque - quantidade;
  await produto.save({ transaction });
}

async function aumentarEstoque(produtoId, quantidade, transaction) {
  if (quantidade <= 0) return;
  const produto = await lockProduto(produtoId, transaction);
  produto.estoque = produto.estoque + quantidade;
  await produto.save({ transaction });
}

module.exports = {
  diminuirEstoque,
  aumentarEstoque,
  lockProduto
};
