const express = require('express');
const router = express.Router();
const cart = require('../../controller/cart');
const userMiddleware = require('../../middleware/user')

router.get('/get', userMiddleware.isLoggedIn, cart.getcart)
router.post('/add', userMiddleware.isLoggedIn, cart.addcart)
router.patch('/update', userMiddleware.isLoggedIn, cart.updatecart)
router.delete('/remove', userMiddleware.isLoggedIn, cart.removecart)

module.exports = router

