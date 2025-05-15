import { Router } from 'express'
import Pessoa from '../models/pessoa'

import { buscaPessoa, deletePessoa, listPessoas, createPessoa, updatePessoa } from '../services/pessoa'

const router = Router()

router.get('/', async (req, res) => {
  const pessoaList = await listPessoas()
  res.send(pessoaList)
})

router.get('/:pessoaId', async (req, res) => {
  try {
    const pessoa = await buscaPessoa(req.params.pessoaId)
    res.status(200).send(pessoa)
  } catch (error) {
    res.status(404).json({ message: 'Pessoa não encontrada' })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)

  try {

    const pessoa = await createPessoa(req.body)

    res.status(201).send(pessoa)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:pessoaId', (req, res) => {
  const id = parseInt(req.params.pessoaId)

  try {
    const pessoa = updatePessoa(id, req, res)
    res.status(200).send(pessoa)
  } catch (error) {
    res.status(401).json({ message: 'Pessoa não encontrada' })
  }
})

router.delete('/:pessoaId', async (req, res) => {

  try {
    await deletePessoa(req.params.pessoaId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Pessoa não encontrada' })
  }
})

export default router
