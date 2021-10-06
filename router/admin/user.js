const express = require('express');
const router = express.Router();
const user = require('../../controller/admin/user');
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)
router.get('/', userMiddleware.isLoggedIn, checkadmin, user.getusers)

module.exports = router