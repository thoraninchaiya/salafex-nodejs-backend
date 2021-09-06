const express = require('express');
const router = express.Router();
const carousel = require('../../controller/carousel');

router.get('/getcarousel', carousel.getcarousel)

module.exports = router