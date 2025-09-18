// src/controllers/user.js
import config from '../config/env/development';
import { Router } from 'express';
import User from '../models/user';
import bcrypt from "bcrypt";
import jwtDecode from "jwt-decode";
import { autenticarToken } from '../middleware/authMiddleware';

import { listUsers, createUser, deleteUser, updateUser, buscaUser, verificaUser } from '../services/user';
import AuthService from '../services/auth';

const authService = new AuthService(User)


const router = Router()

router.get('/', autenticarToken, async (req, res) => {
  const userList = await listUsers()
  res.send(userList)
})

router.get('/info', autenticarToken, async (req, res) => {
  try {
    const user = await buscaUser(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

router.get('/:userId', autenticarToken, async (req, res) => {
  try {
    const user = await buscaUser(req.params.userId)
    res.status(200).send(user)
  } catch (error) {
    res.status(404).json({ message: 'Usuário não encontrado' })
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    const { token, userData } = await authService.signin(email, password)
    res.cookie('token', token, { maxAge: 60 * 60 * 3, httpOnly: true, sameSite: config.COOKIE_SAME_SITE, secure: config.COOKIE_SECURE })
    res.json({ token: token, user: userData /** token: token **/ })
  } catch (err) {
    res.status(401).send({ auth: false, token: null, message: err.message })
  }
})

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.signup({ name, email, password });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/', async (req, res) => {
  try {

    const { name, email, password } = req.body;
    // Gera um salt e faz o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log(name, email, hashedPassword);


    const user = await createUser({ name, email, password: hashedPassword })

    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error.message)
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
