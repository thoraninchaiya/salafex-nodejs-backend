const express = require('express');
const router = express.Router();
const cart = require('../../controller/cart');
const userMiddleware = require('../../middleware/user')
const { userdatainfo } = require('../../controller/user/userdata');

router.get('/get', userMiddleware.isLoggedIn ,cart.getcart)
router.post('/add', userMiddleware.isLoggedIn, userdatainfo, cart.addcart)
router.put('/update', userMiddleware.isLoggedIn, cart.updatecart)
router.post('/remove', userMiddleware.isLoggedIn, cart.removecart)

module.exports = router

