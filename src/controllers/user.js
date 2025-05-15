import { Router } from 'express'
import User from '../models/user'
import bcrypt from "bcrypt";

import { listUsers, createUser, deleteUser, updateUser, buscaUser, verificaUser } from '../services/user'

const router = Router()

router.get('/', async (req, res) => {
  const userList = await listUsers()
  res.send(userList)
})

router.get('/:userId', async (req, res) => {
  try {
    const user = await buscaUser(req.params.userId)
    res.status(200).send(user)
  } catch (error) {
    res.status(404).json({ message: 'Usuário não encontrado' })
  }
})

router.post('/', async (req, res) => {
  try {

    const { name, email, password } = req.body;
    // Gera um salt e faz o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser({ name, email, password: hashedPassword })

    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/login', async (req, res) => {


  try {

    const { name, email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login bem-sucedido', user });

  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/:userId', async (req, res) => {

  try {
    await deleteUser(req.params.userId)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Usuário não encontrado' })
  }
})

router.put('/:userId', async (req, res) => {
  try {
    await updateUser(req.params.userId, req.body)
    res.status(200).send({ ok: true })
  } catch (error) {
    res.status(401).json({ message: 'Usuário não encontrado' })
  }
})

export default router
