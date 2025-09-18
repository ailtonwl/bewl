// import Unidade from '../models/unidade'
const { Unidade } = require('../models');

export const listUnidades = async (req, res) => {
  const unidades = await Unidade.findAll();
  return unidades
}

export const createUnidade = async (unidade) => {

  const createdUnidade = await Unidade.create(unidade)

  console.log(createdUnidade)

  return createdUnidade
}

export const updateUnidade = async (id, req, res) => {

  const updatedUnidade = await Unidade.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedUnidade)

  return updateUnidade
}

export const buscaUnidade = async (id) => {

  const unidade = await Unidade.findOne({
    where: { id },
  })
  return unidade
}

export const deleteUnidade = async (id) => {

  await Unidade.destroy({
    where: { id }
  })
}

