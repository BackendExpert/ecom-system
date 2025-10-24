const express = require('express');
const auth = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/checkPermission');
const ProductController = require('../controllers/product.controller');
const upload = require("../middlewares/uploadMiddleware")

const router = express.Router();

router.post('/create-brand', auth, checkPermission(['create:brand']), upload.single('logoimg'), ProductController.createBrand)

router.post('/create-producttype', auth, checkPermission(['create:producttype']), ProductController.createProductType)

router.post('/create-producttag', auth, checkPermission(['create:producttag']), ProductController.createProductTag)

module.exports = router;