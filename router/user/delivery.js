const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user')
const { getdelivery } = require('../../controller/delivery');
const { userdatainfo } = require('../../controller/user/userdata');

router.get('/:receiptid', userMiddleware.isLoggedIn, userdatainfo, getdelivery)

module.exports = router