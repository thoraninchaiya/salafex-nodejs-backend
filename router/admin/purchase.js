const express = require('express');
const router = express.Router();
const { order, receipts, cancelreceipts, getreceipt , updatedelivery, deliverylist} = require('../../controller/admin/purchase');
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');
const { payment } = require('../../controller/admin/payment');

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)
router.get('/', userMiddleware.isLoggedIn, checkadmin, order)
router.get('/receipts', userMiddleware.isLoggedIn, checkadmin, receipts)
router.post('/getreceipt', userMiddleware.isLoggedIn, checkadmin, getreceipt)
router.post('/receipt/cancel', userMiddleware.isLoggedIn, checkadmin, cancelreceipts)
router.post('/receipt/payment', userMiddleware.isLoggedIn, checkadmin, payment)
router.post('/delivery', userMiddleware.isLoggedIn, checkadmin, updatedelivery)
router.get('/deliverylist', userMiddleware.isLoggedIn, checkadmin, deliverylist)

module.exports = router