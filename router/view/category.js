const express = require('express');
const router = express.Router();
const category = require('../../controller/category');

router.get('/category', category.categroys)
router.get('/category/:id', category.categroy)

module.exports = router