import { Router } from 'express'
import Recebimento from '../models/recebimento'

import { buscaRecebimento, deleteRecebimento, listRecebimentos, createRecebimento, updateRecebimento } from '../services/recebimento'

const router = Router()

router.get('/', async (req, res) => {
  const recebimentoList = await listRecebimentos()
  res.send(recebimentoList)
})

router.get('/:recebimentoId', async (req, res) => {
  try {
    const recebimento = await buscaRecebimento(req.params.recebimentoId)
    res.status(200).send(recebimento)
  } catch (error) {
    res.status(404).json({ message: 'Recebimento não encontrada' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const recebimento = await createRecebimento(req.body)

    res.status(201).send(recebimento)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:recebimentoId', (req, res) => {
  const id = parseInt(req.params.recebimentoId)

  try {
    const recebimento = updateRecebimento(id, req, res)
    res.status(200).send(recebimento)
  } catch (error) {
    res.status(401).json({ message: 'Recebimento não encontrada' })
  }
})

router.delete('/:recebimentoId', async (req, res) => {

  try {
    await deleteRecebimento(req.params.recebimentoId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Recebimento não encontrada' })
  }
})

export default router
