const { Recebimento } = require('../models');
// import Recebimento from '../models/recebimento'

export const listRecebimentos = async (req, res) => {
  const recebimentos = await Recebimento.findAll();
  return recebimentos
}

export const createRecebimento = async (recebimento) => {

  const createdRecebimento = await Recebimento.create(recebimento)

  console.log(createdRecebimento)

  return createdRecebimento
}

export const updateRecebimento = async (id, req, res) => {
  console.log('service: ', id, req.body)

  const updatedRecebimento = await Recebimento.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedRecebimento)

  return updateRecebimento
}

export const buscaRecebimento = async (id) => {
  const recebimento = await Recebimento.findOne({
    where: { id },
  })
  return recebimento
}

export const deleteRecebimento = async (id) => {

  await Recebimento.destroy({
    where: { id }
  })
}

