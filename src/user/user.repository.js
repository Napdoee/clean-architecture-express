const prisma = require("../db");
const { users: Users } = prisma;

const findUsers = async () => {
  const users = await Users.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  return users;
}

const findUserByToken = async (token) => {
  const user = await Users.findFirst({
    where: {
      refresh_token: token,
    }
  })

  return user;
}

const findUserById = async (id) => {
  const user = await Users.findUnique({
    where: {
      id,
    }
  })

  return user;
}

const findUserByEmail = async (email) => {
  const user = await Users.findFirst({
    where: {
      email,
    }
  })

  return user;
}

const findUserByName = async (name) => {
  const user = await Users.findFirst({
    where: {
      name,
    }
  })

  return user;
}

const insertUser = async (newUserData, password) => {
  const user = await Users.create({
    data: {
      name: newUserData.name,
      email: newUserData.email,
      password: password
    }
  })

  return user;
}

const updateToken = async (id, token) => {
  await Users.update({
    where: {
      id
    },
    data: {
      refresh_token: token,
    }
  })
}

module.exports = {
  findUsers,
  findUserById,
  findUserByToken,
  findUserByEmail,
  findUserByName,
  insertUser,
  updateToken
}