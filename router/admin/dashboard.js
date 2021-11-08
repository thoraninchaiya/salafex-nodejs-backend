const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');
const { ordercount, orderdetail, getdatadates} = require('../../controller/admin/dashboard')

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)
router.get('/today', userMiddleware.isLoggedIn, checkadmin, ordercount)
router.get('/today/orderdetail', userMiddleware.isLoggedIn, checkadmin, orderdetail)

router.post('/dates', userMiddleware.isLoggedIn, checkadmin, getdatadates)

module.exports = router