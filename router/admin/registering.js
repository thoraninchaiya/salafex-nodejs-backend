const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');
const { getinfo, register, getregisternoconfirm, clearregisternoconfirm, confirm, success } = require('../../controller/admin/registering');

// router.get('/', userMiddleware.isLoggedIn ,product.getproduct)

// router.get('/', userMiddleware.isLoggedIn, checkadmin, order)

//localhost:8080/admin/registering/
router.post('/', userMiddleware.isLoggedIn, checkadmin, getinfo)

//localhost:8080/admin/registering/register
router.post('/register', userMiddleware.isLoggedIn, checkadmin, register)

//localhost:8080/admin/registering/noconfirm
router.post('/noconfirm', userMiddleware.isLoggedIn, checkadmin, getregisternoconfirm)

//localhost:8080/admin/registering/noconfirm/clear
router.post('/noconfirm/clear', userMiddleware.isLoggedIn, checkadmin, clearregisternoconfirm)

//localhost:8080/admin/registering/confirm
router.post('/confirm', userMiddleware.isLoggedIn, checkadmin, confirm)

//localhost:8080/admin/registering/success
router.post('/success', userMiddleware.isLoggedIn, checkadmin, success)


module.exports = router