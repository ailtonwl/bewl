// src/services/itemcompra.js
const { ItemCompra } = require('../models');

export const listItemCompras = async (req, res) => {
  const itemCompras = await ItemCompra.findAll();
  return itemCompras
}

export const createItemCompra = async (itemCompra) => {

  const createdItemCompra = await ItemCompra.create(itemCompra)

  console.log(createdItemCompra)

  return createdItemCompra
}

export const updateItemCompra = async (id, req, res) => {

  const updatedItemCompra = await ItemCompra.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedItemCompra)

  return updateItemCompra
}

export const buscaItemCompra = async (id) => {

  const itemCompra = await ItemCompra.findOne({
    where: { id },
  })
  return itemCompra
}

export const deleteItemCompra = async (id) => {

  await ItemCompra.destroy({
    where: { id }
  })
}

