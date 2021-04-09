const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { getMe, deleteMe, changePassword } = require("../controllers/userColtroler");

router.get('/users/me', authMiddleware, getMe);
router.delete('/users/me',authMiddleware, deleteMe);
router.patch('/users/me/password',authMiddleware, changePassword);

module.exports = router;
