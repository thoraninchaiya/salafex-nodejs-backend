const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');
const { get, add, edit, del } = require('../../controller/admin/banner')


// /admin/banner/add
router.get('/', userMiddleware.isLoggedIn, checkadmin, get)
router.post('/add', userMiddleware.isLoggedIn, checkadmin, add)
router.post('/edit', userMiddleware.isLoggedIn, checkadmin, edit)
router.post('/del', userMiddleware.isLoggedIn, checkadmin, del)



module.exports = router