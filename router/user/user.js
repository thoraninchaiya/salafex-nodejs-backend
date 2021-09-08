const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const user = require('../../controller/user/user');
const auth = require('../../controller/user/auth');


router.get('/info', userMiddleware.isLoggedIn, user.userinfo)
router.get('/profile', userMiddleware.isLoggedIn, user.userinfo)


router.post('/register', userMiddleware.validateRegister, auth.register)
router.post('/login', auth.login)

module.exports = router