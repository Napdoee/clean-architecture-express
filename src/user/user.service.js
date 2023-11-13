const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const {
  findUsers,
  findUserById,
  findUserByToken,
  findUserByName,
  findUserByEmail,
  insertUser,
  updateToken
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

const createUser = async (newUserData) => {
  const userName = await findUserByName(newUserData.name);
  if (userName) throw new AppError('name has to be unique');

  const userEmail = await findUserByEmail(newUserData.email);
  if (userEmail) throw new AppError('email has to be unique');

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newUserData.password, salt);

  const user = await insertUser(newUserData, hashPassword);

  return user;
}

const authLoginUser = async (email, password) => {
  const user = await findUserByEmail(email)
  if (!user) throw new AppError('email or password doesn\'t match ');

  const match = await bcrypt.compareSync(password, user.password);
  if (!match) throw new AppError('email or password doesn\'t match ');

  const userId = user.id;
  const userName = user.name;
  const userEmail = user.email;

  const accessToken = jwt.sign({ userId, userName, userEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '20s'
  });
  const refreshToken = jwt.sign({ userId, userName, userEmail }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d'
  });

  await updateToken(userId, refreshToken);

  return {
    accessToken,
    refreshToken
  }
}

const authLogoutUser = async (token) => {
  const user = await findUserByToken(token);
  if (!user) throw new AppError(null, 204);
  const userId = user.id;

  await updateToken(userId, null);
}

const generateUserToken = async (token) => {
  const user = await findUserByToken(token);
  if (!user) throw new AppError("token has expired/token not found", 403);

  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) throw new AppError(err.message, 403);

      const userId = user.id;
      const userName = user.name;
      const userEmail = user.email;

      const accessToken = jwt.sign({ userId, userName, userEmail }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s'
      })

      return accessToken;
    }
  );
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  authLoginUser,
  generateUserToken,
  authLogoutUser
}