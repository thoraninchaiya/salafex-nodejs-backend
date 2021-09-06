const express = require('express');
const router = express.Router();
const product = require('../../controller/product');

router.get('/', product.products)
router.get('/newproduct', product.newproduct)
router.get('/registering', product.registeringproducts)

module.exports = router