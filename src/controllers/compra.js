// src/controllers/compra.js
import { Router } from 'express'
import Compra from '../models/compra'
import { autenticarToken } from '../middleware/authMiddleware';

import { buscaCompra, deleteCompra, listCompras, createCompra, updateCompra } from '../services/compra'

const router = Router()

router.get('/', autenticarToken, async (req, res) => {
  const compraList = await listCompras()
  res.send(compraList)
})

router.get('/:compraId', autenticarToken, async (req, res) => {
  try {
    const compra = await buscaCompra(req.params.compraId)
    res.status(200).send(compra)
  } catch (error) {
    res.status(404).json({ message: 'Compra não encontrada' })
  }
})

router.post('/', autenticarToken, async (req, res) => {
  console.log(req.body)

  try {

    const compra = await createCompra(req.body)

    res.status(201).send(compra)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:compraId', autenticarToken, (req, res) => {
  const id = parseInt(req.params.compraId)

  try {
    const compra = updateCompra(id, req, res)
    res.status(200).send(compra)
  } catch (error) {
    res.status(401).json({ message: 'Compra não encontrada' })
  }
})

router.delete('/:compraId', autenticarToken, async (req, res) => {

  try {
    await deleteCompra(req.params.compraId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Compra não encontrada' })
  }
})

export default router
