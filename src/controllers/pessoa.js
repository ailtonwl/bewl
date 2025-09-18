import { Router } from 'express'
import Pessoa from '../models/pessoa'
import { autenticarToken } from '../middleware/authMiddleware';

import { buscaPessoa, deletePessoa, listPessoas, createPessoa, updatePessoa } from '../services/pessoa'

const router = Router()

router.get('/', autenticarToken, async (req, res) => {
  try {
    const pessoaList = await listPessoas()
    res.status(200).send(pessoaList)
  } catch (error) {
    res.status(403).json({ message: 'Acesso não autorizado! Faça login novamente.' })
  }
})

router.get('/:pessoaId', autenticarToken, async (req, res) => {
  try {
    const pessoa = await buscaPessoa(req.params.pessoaId)
    res.status(200).send(pessoa)
  } catch (error) {
    res.status(404).json({ message: 'Pessoa não encontrada' })
  }
})

router.post('/', autenticarToken, async (req, res) => {
  console.log(req.body)

  try {

    const pessoa = await createPessoa(req.body)

    res.status(201).send(pessoa)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put('/:pessoaId', autenticarToken, (req, res) => {
  const id = parseInt(req.params.pessoaId)

  try {
    const pessoa = updatePessoa(id, req, res)
    res.status(200).send(pessoa)
  } catch (error) {
    res.status(401).json({ message: 'Pessoa não encontrada' })
  }
})

router.delete('/:pessoaId', autenticarToken, async (req, res) => {

  try {
    await deletePessoa(req.params.pessoaId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Pessoa não encontrada' })
  }
})

export default router
