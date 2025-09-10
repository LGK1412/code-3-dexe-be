const express = require('express')

const authController = require('../controllers/authController.js')

const { identifyInfo } = require('../middlewares/identification')
const { verifyGoogleToken } = require('../middlewares/googleAuth')

const router = express.Router()

router.post('/signup', authController.singup)
router.post('/signin', authController.singin)
router.post('/logout', identifyInfo, authController.logout)

// Đổi mật khẩu khi ko đăng nhập
router.post('/send-forgot-password', authController.sendForgotPasswordCode)
router.post('/verify-forgot-password', authController.verifyForgotPasswordCode)

router.post("/google", authController.logInGoogle)

router.patch("/update/:userId", authController.updateUserProfile)

module.exports = router