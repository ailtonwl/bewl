import { Router } from 'express'
import Produto from '../models/produto'
import { autenticarToken } from '../middleware/authMiddleware';

import { buscaProduto, deleteProduto, listProdutos, createProduto, updateProduto } from '../services/produto'

const router = Router()

router.get('/', autenticarToken, async (req, res) => {
  const produtoList = await listProdutos()
  res.send(produtoList)
})

router.get('/:produtoId', autenticarToken, async (req, res) => {
  try {
    const produto = await buscaProduto(req.params.produtoId)
    res.status(200).send(produto)
  } catch (error) {
    res.status(404).json({ message: 'Produto não encontrado' })
  }
})

router.post('/', autenticarToken, async (req, res) => {
  console.log(req.body)

  try {

    const produto = await createProduto(req.body)

    res.status(201).send(produto)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:produtoId', autenticarToken, (req, res) => {
  const id = parseInt(req.params.produtoId)

  try {
    const produto = updateProduto(id, req, res)
    res.status(200).send(produto)
  } catch (error) {
    res.status(401).json({ message: 'Produto não encontrado' })
  }
})

router.delete('/:produtoId', autenticarToken, async (req, res) => {

  try {
    await deleteProduto(req.params.produtoId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Produto não encontrado' })
  }
})

export default router
