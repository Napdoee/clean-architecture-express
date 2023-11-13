const express = require('express');
const router = express();

const userController = require('./user/user.controller');
const projectController = require('./project/project.controller');

const verifyToken = require("./middleware/verifyToken");

router.get('/', (req, res) => {
  res.send('Welcome To My Portfolio-API');
});

router.use(userController);
// router.use('/projects', verifyToken, projectController);
router.use('/projects', projectController);

module.exports = router;