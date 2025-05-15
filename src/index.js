import express from 'express'
import sequelize from './config/database'
import User from './models/user'
import cors from 'cors'

// import bodyParser from 'body-parser'

import userController from './controllers/user'
import pessoaController from './controllers/pessoa'
import unidadeController from './controllers/unidade'
import produtoController from './controllers/produto'

const app = express()
const port = 8080

// app.use(bodyParser.json())

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173'
}))

// Sincronizar o banco de dados
sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

/* app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
 */

app.use('/user', userController)
app.use('/pessoa', pessoaController)
app.use('/unidade', unidadeController)
app.use('/produto', produtoController)

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`)
})
