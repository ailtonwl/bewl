// import databaseConnection from '../utils/database'
import Pessoa from '../models/pessoa'

export const listPessoas = async (req, res) => {
  const pessoas = await Pessoa.findAll();
  return pessoas
}

export const createPessoa = async (pessoa) => {

  const createdPessoa = await Pessoa.create(pessoa)

  console.log(createdPessoa)

  return createdPessoa
}

export const updatePessoa = async (id, req, res) => {
  console.log('service: ', id, req.body)

  const updatedPessoa = await Pessoa.update(
    req.body,
    {
      where: { id },
    },
  );

  console.log(updatedPessoa)

  return updatePessoa
}

export const buscaPessoa = async (id) => {
  // console.log('usuarioId', id)
  const pessoa = await Pessoa.findOne({
    where: { id },
  })
  return pessoa
}

export const deletePessoa = async (id) => {

  await Pessoa.destroy({
    where: { id }
  })
}

