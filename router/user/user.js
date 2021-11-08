const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const {edit, info, profile, receipthistory, receipt, cancelreceipt} = require('../../controller/user/user');
const auth = require('../../controller/user/auth');
const {userdatainfo} = require('../../controller/user/userdata')


router.get('/info', userMiddleware.isLoggedIn, info)
router.get('/profile', userMiddleware.isLoggedIn, profile)
router.put('/edit', userMiddleware.isLoggedIn, edit)
router.get('/receipthistory', userMiddleware.isLoggedIn, userdatainfo, receipthistory)
router.get('/receipt/:id', userMiddleware.isLoggedIn, userdatainfo, receipt)
router.post('/cancelreceipt', userMiddleware.isLoggedIn, userdatainfo, cancelreceipt)

router.post('/register', userMiddleware.validateRegister, auth.register)
router.post('/login', auth.login)

module.exports = router