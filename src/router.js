const express = require('express');
const router = express();

const authController = require('./_auth/auth.controller');
const userController = require('./_user/user.controller');
const projectController = require('./_project/project.controller');

const verifyToken = require("./middleware/verifyToken");

router.get('/', (req, res) => {
  res.send('Welcome To My Portfolio-API');
});

router.use(authController);
router.use('/users', userController);
router.use('/projects', projectController);

module.exports = router;