import { Pool } from 'pg'

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wlvendas',
  password: 'root',
  port: 5432,
});

const databaseConnection = async () => {
  if (!global.Pool) {
    Pool.set('strictQuery', false)
    global.Pool = await Pool.connect(pool)
  }
}

export default databaseConnection
