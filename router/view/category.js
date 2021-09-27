const express = require('express');
const router = express.Router();
const category = require('../../controller/category');

router.get('/', category.categroys)
router.get('/:id', category.categroy)

module.exports = router