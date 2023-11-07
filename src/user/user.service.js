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
  if (!user) throw new AppError('User not found', 404);

  return user;
}

const getUserByEmail = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError('Email not found', 404);

  return user;
}

const createUser = async (newUserData) => {
  if (newUserData.password !== newUserData.confPassword)
    throw new AppError('Password and Confirm Password not match');

  const userName = await findUserByName(newUserData.name);
  if (userName) throw new AppError('Name has to be unique');

  const userEmail = await findUserByEmail(newUserData.email);
  if (userEmail) throw new AppError('Email has to be unique');

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newUserData.password, salt);

  const user = await insertUser(newUserData, hashPassword);

  return user;
}

const authLoginUser = async (email, password) => {
  const user = await getUserByEmail(email);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Wrong Password');

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
  if (!user) return new AppError(null, 403);

  const verifyToken = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return new AppError(null, 403);

      const userId = user.id;
      const userName = user.name;
      const userEmail = user.email;

      const accessToken = jwt.sign({ userId, userName, userEmail }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s'
      })

      return accessToken;
    }
  );

  return verifyToken;
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmail,
  authLoginUser,
  generateUserToken,
  authLogoutUser
}