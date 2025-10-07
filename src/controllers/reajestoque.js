import { Router } from 'express'
import ReajEstoque from '../models/reajestoque'

import { buscaReajEstoque, deleteReajEstoque, listReajEstoques, createReajEstoque, updateReajEstoque } from '../services/reajestoque'

const router = Router()

router.get('/', async (req, res) => {
  const reajEstoqueList = await listReajEstoques()
  res.send(reajEstoqueList)
})

router.get('/:reajEstoqueId', async (req, res) => {
  try {
    const reajEstoque = await buscaReajEstoque(req.params.reajEstoqueId)
    res.status(200).send(reajEstoque)
  } catch (error) {
    res.status(404).json({ message: 'ReajEstoque não encontrada' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const reajEstoque = await createReajEstoque(req.body)

    res.status(201).send(reajEstoque)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:reajEstoqueId', (req, res) => {
  const id = parseInt(req.params.reajEstoqueId)

  try {
    const reajEstoque = updateReajEstoque(id, req, res)
    res.status(200).send(reajEstoque)
  } catch (error) {
    res.status(401).json({ message: 'ReajEstoque não encontrada' })
  }
})

router.delete('/:reajEstoqueId', async (req, res) => {

  try {
    await deleteReajEstoque(req.params.reajEstoqueId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'ReajEstoque não encontrada' })
  }
})

export default router
