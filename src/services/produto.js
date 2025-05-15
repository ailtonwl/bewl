import Produto from '../models/produto'

export const listProdutos = async (req, res) => {
  const produtos = await Produto.findAll();
  return produtos
}

export const createProduto = async (produto) => {

  const createdProduto = await Produto.create(produto)

  console.log(createdProduto)

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

  console.log(updatedProduto)

  return updateProduto
}

export const buscaProduto = async (id) => {
  const produto = await Produto.findOne({
    where: { id },
  })
  return produto
}

export const deleteProduto = async (id) => {

  await Produto.destroy({
    where: { id }
  })
}

