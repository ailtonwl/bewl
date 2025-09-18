import { Router } from 'express'
import ItemReajEstoque from '../models/itemReajEstoque'

import { buscaItemReajEstoque, deleteItemReajEstoque, listItemReajEstoques, createItemReajEstoque, updateItemReajEstoque } from '../services/itemReajEstoque'

const router = Router()

router.get('/', async (req, res) => {
  const itemReajEstoqueList = await listItemReajEstoques()
  res.send(itemReajEstoqueList)
})

router.get('/:itemReajEstoqueId', async (req, res) => {
  try {
    const itemReajEstoque = await buscaItemReajEstoque(req.params.itemReajEstoqueId)
    res.status(200).send(itemReajEstoque)
  } catch (error) {
    res.status(404).json({ message: 'Item de reajEstoque não encontrado' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const itemReajEstoque = await createItemReajEstoque(req.body)

    res.status(201).send(itemReajEstoque)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:itemReajEstoqueId', (req, res) => {
  const id = parseInt(req.params.itemReajEstoqueId)

  try {
    const itemReajEstoque = updateItemReajEstoque(id, req, res)
    res.status(200).send(itemReajEstoque)
  } catch (error) {
    res.status(401).json({ message: 'Item de reajEstoque não encontrado' })
  }
})

router.delete('/:itemReajEstoqueId', async (req, res) => {

  try {
    await deleteItemReajEstoque(req.params.itemReajEstoqueId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Item de reajEstoque não encontrado' })
  }
})

export default router
