// src/controllers/itemcompra.js
import { Router } from 'express'
import ItemCompra from '../models/itemCompra'

import { buscaItemCompra, deleteItemCompra, listItemCompras, createItemCompra, updateItemCompra } from '../services/itemCompra'

const router = Router()

router.get('/', async (req, res) => {
  const itemCompraList = await listItemCompras()
  res.send(itemCompraList)
})

router.get('/:itemCompraId', async (req, res) => {
  try {
    const itemCompra = await buscaItemCompra(req.params.itemCompraId)
    res.status(200).send(itemCompra)
  } catch (error) {
    res.status(404).json({ message: 'Item de compra não encontrado' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const itemCompra = await createItemCompra(req.body)

    res.status(201).send(itemCompra)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:itemCompraId', (req, res) => {
  const id = parseInt(req.params.itemCompraId)

  try {
    const itemCompra = updateItemCompra(id, req, res)
    res.status(200).send(itemCompra)
  } catch (error) {
    res.status(401).json({ message: 'Item de compra não encontrado' })
  }
})

router.delete('/:itemCompraId', async (req, res) => {

  try {
    await deleteItemCompra(req.params.itemCompraId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Item de compra não encontrado' })
  }
})

export default router
