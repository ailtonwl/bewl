import { Router } from 'express'
import ItemVenda from '../models/itemVenda'

import { buscaItemVenda, deleteItemVenda, listItemVendas, createItemVenda, updateItemVenda } from '../services/itemVenda'

const router = Router()

router.get('/', async (req, res) => {
  const itemVendaList = await listItemVendas()
  res.send(itemVendaList)
})

router.get('/:itemVendaId', async (req, res) => {
  try {
    const itemVenda = await buscaItemVenda(req.params.itemVendaId)
    res.status(200).send(itemVenda)
  } catch (error) {
    res.status(404).json({ message: 'Item de venda não encontrado' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const itemVenda = await createItemVenda(req.body)

    res.status(201).send(itemVenda)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:itemVendaId', (req, res) => {
  const id = parseInt(req.params.itemVendaId)

  try {
    const itemVenda = updateItemVenda(id, req, res)
    res.status(200).send(itemVenda)
  } catch (error) {
    res.status(401).json({ message: 'Item de venda não encontrado' })
  }
})

router.delete('/:itemVendaId', async (req, res) => {

  try {
    await deleteItemVenda(req.params.itemVendaId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Item de venda não encontrado' })
  }
})

export default router
