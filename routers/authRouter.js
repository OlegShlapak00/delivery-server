const express = require('express');
const router = express.Router();

const { register, login, forgot_password } = require("../controllers/authController");

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot_password', forgot_password);


module.exports = router;
