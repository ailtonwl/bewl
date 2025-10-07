// src/index.js
import express from 'express'
import sequelize from './config/database'
import cors from 'cors'

import User from './models/user'

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

const app = express()
const port = 8080

app.use(express.json())

const allowedOrigin = 'http://189.126.106.253:5173'

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (origin === allowedOrigin) return callback(null, true)
    return callback(new Error('Origin not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'OPTIONS', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Sincronizar o banco de dados
sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

app.use('/user', userController)
app.use('/pessoa', pessoaController)
app.use('/unidade', unidadeController)
app.use('/produto', produtoController)
app.use('/compra', compraController)
app.use('/itemcompra', itemCompraController)
app.use('/venda', vendaController)
app.use('/itemvenda', itemVendaController)
app.use('/recebimento', recebimentoController)
app.use('/reajestoque', reajEstoqueController)
app.use('/itemreajestoque', itemReajEstoqueController)

app.listen(port, '0.0.0.0', () => {
  console.log(`App rodando em http://0.0.0.0:${port}`)
})
