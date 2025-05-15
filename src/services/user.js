// import databaseConnection from '../utils/database'
import User from '../models/user'

export const listUsers = async (req, res) => {
  const users = await User.findAll();
  return users
}

export const createUser = async (user) => {
  const createdUser = await User.create(user)

  console.log(createdUser)

  return createdUser
}

export const verificaUser = async (user) => {

  console.log(user.email, user.password)

  userLogado = await User.findOne({ where: { email: user.email, password: user.password } })


  console.log("Usuário logado: ", JSON.stringify(userLogado));


  if (userLogado === null) {
    console.log('Not found!')
  } else {
    // console.log(userLogado instanceof User); // true
    console.log(userLogado.name) // 'My Title'
  }
  return userLogado
}

export const buscaUser = async (id) => {
  // console.log('usuarioId', id)
  const user = await User.findOne({
    where: { id },
  })
  return user
}

export const deleteUser = async (id) => {

  await User.destroy({
    where: { id }
  })
}

export const updateUser = async (id, newBody) => {
  console.log(id, newBody)

  await User.update(
    newBody,
    {
      where: { id },
    },
  );
}

