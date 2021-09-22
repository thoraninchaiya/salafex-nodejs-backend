const express = require('express');
const router = express.Router();
const purchase = require('../../controller/purchase');
const userMiddleware = require('../../middleware/user')
const { userdatainfo } = require('../../controller/user/userdata');

router.post('/checkout', userMiddleware.isLoggedIn, userdatainfo, purchase.checkout)

module.exports = router