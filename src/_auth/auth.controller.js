const { Router } = require("express");
const router = Router();

const {
  createUser,
  authLoginUser,
  authLogoutUser,
  generateUserToken
} = require('./auth.service');
const {
  registerValidateSchema,
  loginValidateSchema
} = require('./auth.validations');

const validate = require("../middleware/validate");

const { succesResponse, msgResponse } = require("../utils/sendResponse");
const tryCatch = require("../utils/tryCatch");

router.post('/register',
  validate(registerValidateSchema),
  tryCatch(async (req, res) => {
    const newUserData = req.body;

    await createUser(newUserData);

    return res.status(201).send(
      msgResponse('create user success')
    );
  })
)

router.post('/login',
  validate(loginValidateSchema),
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

router.delete('/logout',
  tryCatch(async (req, res) => {
    const tokenCookies = await req.cookies.refreshToken;
    await authLogoutUser(tokenCookies);

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
  })
)

module.exports = router;