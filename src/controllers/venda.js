import { Router } from 'express'
import Venda from '../models/venda'
import { autenticarToken } from '../middleware/authMiddleware';

import { buscaVenda, deleteVenda, listVendas, createVenda, updateVenda } from '../services/venda'
import { updateVendaRec } from '../services/venda'

const router = Router()

router.get('/', autenticarToken, async (req, res) => {
  const vendaList = await listVendas()
  res.send(vendaList)
})

router.get('/:vendaId', autenticarToken, async (req, res) => {
  try {
    const venda = await buscaVenda(req.params.vendaId)
    res.status(200).send(venda)
  } catch (error) {
    res.status(404).json({ message: 'Venda não encontrada' })
  }
})

router.post('/', autenticarToken, async (req, res) => {
  console.log(req.body)

  try {

    const venda = await createVenda(req.body)

    res.status(201).send(venda)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:vendaId', autenticarToken, (req, res) => {
  const id = parseInt(req.params.vendaId)

  try {
    const venda = updateVenda(id, req, res)
    res.status(200).send(venda)
  } catch (error) {
    res.status(401).json({ message: 'Venda não encontrada' })
  }
})

router.put('/receb/:vendaId', (req, res) => {
  const id = parseInt(req.params.vendaId)

  console.log('Cheguei /receb/id', id);
  console.log('req: ', req);

  updateVendaRec(id, req, res)

  // try {
  //   const venda = updateVendaRec(id, req, res)
  // res.status(200).send(venda)
  // } catch (error) {
  // res.status(401).json({ message: 'Venda não encontrada' })
  // }
})

router.delete('/:vendaId', autenticarToken, (req, res) => {

  try {
    deleteVenda(req.params.vendaId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Venda não encontrada' })
  }
})

export default router
