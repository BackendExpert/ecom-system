const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/registation', AuthController.registation)

module.exports = router;