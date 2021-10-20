const express = require('express');
const router = express.Router();
const {add, show} = require('../../controller/comment');
const { userdatainfo } = require('../../controller/user/userdata');
const {isLoggedIn} = require('../../middleware/user')

router.get('/product/:productid', show) //localhost:8080/comment/product/1
router.post('/add/product/:productid', isLoggedIn, userdatainfo, add) //localhost:8080/comment/add/product/1

module.exports = router