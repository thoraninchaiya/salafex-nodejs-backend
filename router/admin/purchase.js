const express = require('express');
const router = express.Router();
const { order } = require('../../controller/admin/purchase');
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)
router.get('/', userMiddleware.isLoggedIn, checkadmin, order)

module.exports = router