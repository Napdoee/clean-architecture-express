const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const {
  findUserByToken,
  findUserByName,
  findUserByEmail,
  insertUser,
  updateToken
} = require('../_user/user.repository.js');
const AppError = require('../utils/appError');

const signAccessToken = (user) => {
  const accessToken = jwt.sign({
    _id: user.id,
    username: user.name,
    email: user.email
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30m'
  });

  return accessToken;
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

  const accessToken = signAccessToken(user);

  const refreshToken = jwt.sign({
    _id: user.id,
    username: user.name,
    email: user.email
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d'
  });

  await updateToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken
  }
}

const authLogoutUser = async (token) => {
  const user = await findUserByToken(token);
  if (!user) throw new AppError(null, 204);

  await updateToken(user.id, null);
}

const generateUserToken = async (token) => {
  const user = await findUserByToken(token);
  if (!user) throw new AppError("token has expired/token not found", 402);

  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) throw new AppError(err.message, 403);

      const accessToken = signAccessToken(user);

      return accessToken;
    }
  );
}

module.exports = {
  createUser,
  authLoginUser,
  generateUserToken,
  authLogoutUser
}