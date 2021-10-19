const express = require('express');
const router = express.Router();
const {checkout, listcheckout, receipt, payment} = require('../../controller/purchase');
const userMiddleware = require('../../middleware/user')
const { orderlist} = require('../../controller/purchase');
const { userdatainfo } = require('../../controller/user/userdata');

router.post('/checkout', userMiddleware.isLoggedIn, userdatainfo, checkout, receipt)
router.get('/listcheckout', userMiddleware.isLoggedIn, userdatainfo, listcheckout)
router.post('/receipt/payment', userMiddleware.isLoggedIn, userdatainfo, payment)
// router.post('/order', userMiddleware.isLoggedIn, userdatainfo)

module.exports = router