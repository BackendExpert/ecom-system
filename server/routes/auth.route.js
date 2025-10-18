const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/registation', AuthController.registation)

router.post('/verify-email', AuthController.verifyEmail)

module.exports = router;