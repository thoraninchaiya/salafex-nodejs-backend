const express = require('express');
const router = express.Router();
const product = require('../../controller/product');
const { userdatainfo } = require('../../controller/user/userdata');
const { registering, getregistering } = require('../../controller/registering');
const userMiddleware = require('../../middleware/user')



router.get('/', product.products)
router.get('/new', product.newproduct)
router.get('/registering', product.registeringproducts)
router.get('/bestseller', product.bestseller)

router.post('/registering', userMiddleware.isLoggedIn ,userdatainfo, registering)
router.get('/registering/users/:product', getregistering)

module.exports = router