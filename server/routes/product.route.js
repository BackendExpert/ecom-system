const express = require('express');
const auth = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/checkPermission');
const ProductController = require('../controllers/product.controller');

const router = express.Router();

router.post('/create-brand', auth, checkPermission(['create:brand']), ProductController.createBrand)

router.post('/create-producttype', auth, checkPermission(['create:producttype']), ProductController.createProductType)

module.exports = router;