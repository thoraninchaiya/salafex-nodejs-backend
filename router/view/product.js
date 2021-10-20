const express = require('express');
const router = express.Router();
const product = require('../../controller/product');
const { userdatainfo } = require('../../controller/user/userdata');
const userMiddleware = require('../../middleware/user')



router.get('/', product.products)
router.get('/new', product.newproduct)
router.get('/registering', product.registeringproducts)
router.get('/bestseller', product.bestseller)
router.post('/registering', userMiddleware.isLoggedIn ,userdatainfo, product.registering)

module.exports = router