import express from 'express'
import sequelize from './config/database'
// import config from './config/env/development'

import User from './models/user'
import cors from 'cors'

// import bodyParser from 'body-parser'

import userController from './controllers/user'
import pessoaController from './controllers/pessoa'
import unidadeController from './controllers/unidade'
import produtoController from './controllers/produto'
import compraController from './controllers/compra'
import itemCompraController from './controllers/itemcompra'
import vendaController from './controllers/venda'
import itemVendaController from './controllers/itemvenda'
import recebimentoController from './controllers/recebimento'
import reajEstoqueController from './controllers/reajestoque'
import itemReajEstoqueController from './controllers/itemreajestoque'
// import authController from './controllers/auth'

const app = express()
const port = 8080

// app.use(bodyParser.json())

app.use(express.json())
app.use(cors({
  // origin: '*'
  origin: 'http://localhost:5173',
  credentials: true, // token in cookie
  methods: 'GET,PUT,POST,OPTIONS, DELETE'
}))

// Sincronizar o banco de dados
sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

app.use('/user', userController)
// app.use('/signin', authController)
app.use('/pessoa', pessoaController)
app.use('/unidade', unidadeController)
app.use('/produto', produtoController)
app.use('/compra', compraController)
app.use('/itemcompra', itemCompraController)
app.use('/venda', vendaController)
app.use('/itemvenda', itemVendaController)
app.use('/recebimento', recebimentoController)
app.use('/reajestoque', reajEstoqueController)
app.use('/itemreajestoque', itemVendaController)

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`)
})
