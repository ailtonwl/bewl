const { ItemReajEstoque } = require('../models');

export const listItemReajEstoques = async (req, res) => {
  const itemReajEstoques = await ItemReajEstoque.findAll();
  return itemReajEstoques
}

export const createItemReajEstoque = async (itemReajEstoque) => {

  const createdItemReajEstoque = await ItemReajEstoque.create(itemReajEstoque)

  console.log(createdItemReajEstoque)

  return createdItemReajEstoque
}

export const updateItemReajEstoque = async (id, req, res) => {

  const updatedItemReajEstoque = await ItemReajEstoque.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedItemReajEstoque)

  return updateItemReajEstoque
}

export const buscaItemReajEstoque = async (id) => {

  const itemReajEstoque = await ItemReajEstoque.findOne({
    where: { id },
  })
  return itemReajEstoque
}

export const deleteItemReajEstoque = async (id) => {

  await ItemReajEstoque.destroy({
    where: { id }
  })
}

