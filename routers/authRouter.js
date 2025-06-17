const express = require('express')

const authController = require('../controllers/authController.js')

const { identifyInfo } = require('../middlewares/identification')
const { verifyGoogleToken } = require('../middlewares/googleAuth')

const router = express.Router()

router.post('/signup', authController.singup)
router.post('/signin', authController.singin)
router.post('/logout', identifyInfo, authController.logout)

router.patch('/send-verification-code', authController.sendVerificationCode)
router.patch('/verify-verification-code', authController.verifyVerificationCode)

// ĐỔi mật khẩu khi còn đăng nhập
router.post('/send-change-password', identifyInfo, authController.sendChangePasswordCode)
router.post('/verify-change-password', authController.verifyChangePasswordCode)

// Đổi mật khẩu khi ko đăng nhập
router.post('/send-forgot-password', authController.sendForgotPasswordCode)
router.post('/verify-forgot-password', authController.verifyForgotPasswordCode)

router.post("/google", verifyGoogleToken, authController.logInGoogle)

module.exports = router