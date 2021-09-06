const express = require('express');
const router = express.Router();
const carousel = require('../../controller/carousel');

router.get('/', carousel.getcarousel)
// router.get('/getcarousel', )

module.exports = router