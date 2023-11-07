const express = require("express");

const {
  getAllUsers,
  createUser,
  getUserByEmail,
  authLoginUser,
  authLogoutUser,
  generateUserToken
} = require('./user.service');
const { verifyToken } = require("../middleware/verifyToken");
const { succesResponse, msgResponse } = require("../utils/sendResponse.js");
const tryCatch = require("../utils/tryCatch");

const router = express.Router();

router.get('/users', verifyToken, async (req, res) => {
  const users = await getAllUsers();

  return res.send(succesResponse({ users }));
});

router.post('/users',
  tryCatch(async (req, res) => {
    const newUserData = req.body;

    await createUser(newUserData);

    return res.status(201).send(
      msgResponse('create user success')
    );
  })
)

router.post('/login',
  tryCatch(async (req, res) => {
    const { email, password } = req.body;

    const { refreshToken, accessToken } = await authLoginUser(email, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    res.send(succesResponse({ accessToken }));
  })
);

router.get('/token',
  tryCatch(async (req, res) => {
    const tokenCookies = req.cookies.refreshToken;

    const generateToken = await generateUserToken(tokenCookies);

    res.send(succesResponse({ accessToken: generateToken }))
  })
);

router.get('/cookie', (req, res) => {
  let Cookies = JSON.stringify(req.cookies)

  console.log({ Cookies });
  return res.send({ Cookies });
})

router.delete('/logout',
  tryCatch(async (req, res) => {
    const tokenCookies = await req.cookies.refreshToken;
    await authLogoutUser(tokenCookies);

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  })
)

module.exports = router;