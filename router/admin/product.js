const express = require('express');
const router = express.Router();
const {getproduct, addproduct, editproductstatus, delproduct, getproductregistering} = require('../../controller/admin/product');
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');

// http://localhost:8080/admin/product/
// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)
router.get('/', userMiddleware.isLoggedIn, checkadmin, getproduct)
router.post('/new', userMiddleware.isLoggedIn, checkadmin, addproduct)
router.post('/edit', userMiddleware.isLoggedIn, checkadmin, editproductstatus)
router.post('/del', userMiddleware.isLoggedIn, checkadmin, delproduct)
router.get('/registering', userMiddleware.isLoggedIn, checkadmin, getproductregistering)


module.exports = router