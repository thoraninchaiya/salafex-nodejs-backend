const express = require('express');
const router = express.Router();
const product = require('../../controller/product');

router.get('/', product.products)
router.get('/new', product.newproduct)
router.get('/registering', product.registeringproducts)
router.get('/bestseller', product.bestseller)

module.exports = router