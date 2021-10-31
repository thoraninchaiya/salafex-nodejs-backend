const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');
const { getinfo, register, getregisternoconfirm } = require('../../controller/admin/registering');

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)

// router.get('/', userMiddleware.isLoggedIn, checkadmin, order)

//localhost:8080/admin/registering/
router.post('/', userMiddleware.isLoggedIn, checkadmin, getinfo)
//localhost:8080/admin/registering/register
router.post('/register', userMiddleware.isLoggedIn, checkadmin, register)
router.post('/noconfirm', userMiddleware.isLoggedIn, checkadmin, getregisternoconfirm)


module.exports = router