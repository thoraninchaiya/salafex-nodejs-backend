const express = require('express');
const router = express.Router();
const product = require('../../controller/admin/product');
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)
router.get('/', userMiddleware.isLoggedIn, checkadmin, product.getproduct)

module.exports = router