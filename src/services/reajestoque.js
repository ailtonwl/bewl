const { ReajEstoque } = require('../models');
// import ReajEstoque from '../models/reajEstoque'

export const listReajEstoques = async (req, res) => {
  const reajEstoques = await ReajEstoque.findAll();
  return reajEstoques
}

export const createReajEstoque = async (reajEstoque) => {

  const createdReajEstoque = await ReajEstoque.create(reajEstoque)

  console.log(createdReajEstoque)

  return createdReajEstoque
}

export const updateReajEstoque = async (id, req, res) => {
  console.log('service: ', id, req.body)

  const updatedReajEstoque = await ReajEstoque.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedReajEstoque)

  return updateReajEstoque
}

export const buscaReajEstoque = async (id) => {
  const reajEstoque = await ReajEstoque.findOne({
    where: { id },
  })
  return reajEstoque
}

export const deleteReajEstoque = async (id) => {

  await ReajEstoque.destroy({
    where: { id }
  })
}

