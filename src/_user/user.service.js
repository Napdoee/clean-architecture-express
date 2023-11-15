const {
  findUsers,
  findUserById,
  deleteUser
} = require('./user.repository');
const AppError = require('../utils/appError');

const getAllUsers = async () => {
  const users = await findUsers();

  return users;
}

const getUserById = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new AppError('user not found', 404);

  return user;
}

const destroyUser = async (userId) => {
  await getUserById(userId);

  await deleteUser(userId)
}

module.exports = {
  getAllUsers,
  getUserById,
  destroyUser
}