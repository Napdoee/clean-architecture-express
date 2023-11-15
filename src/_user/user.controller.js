const { Router } = require("express");
const router = Router();

const {
  getAllUsers,
  getUserById,
  destroyUser
} = require('./user.service');

const verifyToken = require("../middleware/verifyToken");

const { succesResponse, msgResponse } = require("../utils/sendResponse");
const tryCatch = require("../utils/tryCatch");

router.get('/', verifyToken, async (req, res) => {
  const users = await getAllUsers();

  return res.send(succesResponse({ users }));
});

router.get('/:id', verifyToken,
  tryCatch(async (req, res) => {
    const userId = req.params.id;
    const user = await getUserById(userId);

    return res.send(succesResponse({ user }));
  })
)

router.delete('/:id', verifyToken,
  tryCatch(async (req, res) => {
    const userId = req.params.id;
    await destroyUser(userId);

    return res.send(msgResponse('user success deleted'));
  })
)

module.exports = router;