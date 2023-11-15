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
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  return user;
}

const findUserById = async (id) => {
  const user = await Users.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return user;
}

const findUserByEmail = async (email) => {
  const user = await Users.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true
    }
  })

  return user;
}

const findUserByName = async (name) => {
  const user = await Users.findFirst({
    where: {
      name,
    },
    select: {
      name: true,
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

const deleteUser = async (id) => {
  await Users.delete({
    where: {
      id
    }
  })
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
  deleteUser,
  updateToken
}