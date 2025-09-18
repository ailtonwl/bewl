import { Router } from 'express'
import Unidade from '../models/unidade'
import { autenticarToken } from '../middleware/authMiddleware';

import { buscaUnidade, deleteUnidade, listUnidades, createUnidade, updateUnidade } from '../services/unidade'

const router = Router()

router.get('/', autenticarToken, async (req, res) => {
  const unidadeList = await listUnidades()
  res.send(unidadeList)
})

router.get('/:unidadeId', autenticarToken, async (req, res) => {
  try {
    const unidade = await buscaUnidade(req.params.unidadeId)
    res.status(200).send(unidade)
  } catch (error) {
    res.status(404).json({ message: 'Unidade não encontrada' })
  }
})

router.post('/', autenticarToken, async (req, res) => {
  console.log(req.body)

  try {

    const unidade = await createUnidade(req.body)

    res.status(201).send(unidade)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:unidadeId', autenticarToken, (req, res) => {
  const id = parseInt(req.params.unidadeId)

  try {
    const unidade = updateUnidade(id, req, res)
    res.status(200).send(unidade)
  } catch (error) {
    res.status(401).json({ message: 'Unidade não encontrada' })
  }
})

router.delete('/:unidadeId', autenticarToken, async (req, res) => {

  try {
    await deleteUnidade(req.params.unidadeId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Unidade não encontrada' })
  }
})

export default router
