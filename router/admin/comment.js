const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const { checkadmin } = require('../../controller/admin/admin');
const { get, add, edit, del, approve, cancelreview } = require('../../controller/admin/comment')


// router.get('/', userMiddleware.isLoggedIn, checkadmin, get)


//localhost:8080/admin/comment/
router.post('/', userMiddleware.isLoggedIn, checkadmin, get)

//localhost:8080/admin/comment/edit
router.post('/edit', userMiddleware.isLoggedIn, checkadmin, edit)

//localhost:8080/admin/comment/approve
router.post('/approve', userMiddleware.isLoggedIn, checkadmin, approve)

//localhost:8080/admin/comment/cancel
router.post('/cancel', userMiddleware.isLoggedIn, checkadmin, cancelreview)

module.exports = router