import { Router } from 'express'
import Unidade from '../models/unidade'

import { buscaUnidade, deleteUnidade, listUnidades, createUnidade, updateUnidade } from '../services/unidade'

const router = Router()

router.get('/', async (req, res) => {
  const unidadeList = await listUnidades()
  res.send(unidadeList)
})

router.get('/:unidadeId', async (req, res) => {
  try {
    const unidade = await buscaUnidade(req.params.unidadeId)
    res.status(200).send(unidade)
  } catch (error) {
    res.status(404).json({ message: 'Unidade não encontrada' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const unidade = await createUnidade(req.body)

    res.status(201).send(unidade)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:unidadeId', (req, res) => {
  const id = parseInt(req.params.unidadeId)

  try {
    const unidade = updateUnidade(id, req, res)
    res.status(200).send(unidade)
  } catch (error) {
    res.status(401).json({ message: 'Unidade não encontrada' })
  }
})

router.delete('/:unidadeId', async (req, res) => {

  try {
    await deleteUnidade(req.params.unidadeId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Unidade não encontrada' })
  }
})

export default router
