const { ItemVenda } = require('../models');

export const listItemVendas = async (req, res) => {
  const itemVendas = await ItemVenda.findAll();
  return itemVendas
}

export const createItemVenda = async (itemVenda) => {

  const createdItemVenda = await ItemVenda.create(itemVenda)

  console.log(createdItemVenda)

  return createdItemVenda
}

export const updateItemVenda = async (id, req, res) => {

  const updatedItemVenda = await ItemVenda.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedItemVenda)

  return updateItemVenda
}

export const buscaItemVenda = async (id) => {

  const itemVenda = await ItemVenda.findOne({
    where: { id },
  })
  return itemVenda
}

export const deleteItemVenda = async (id) => {

  await ItemVenda.destroy({
    where: { id }
  })
}

