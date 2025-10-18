const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/registation', AuthController.registation)

router.post('/verify-email', AuthController.verifyEmail)

router.post('/login', AuthController.login)

router.post('/logout', AuthController.logout)

router.post('/forget-password', AuthController.forgetpassword)

router.post('/verify-otp', AuthController.verifyotp)

router.post('/update-password', AuthController.updatePassword)

module.exports = router;