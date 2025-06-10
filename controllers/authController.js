const jwt = require('jsonwebtoken')
const { signupSchema, signinSchema, acceptCodeSchema, acceptLogoutSchema, changePasswordSchema, acceptChangePassCodeSchema } = require("../middlewares/validator")
const usersModel = require("../models/users.model")
const { doHasing, doHashValidation, hmacProcess } = require("../utils/hasing")
const transport = require('../middlewares/sendEmail')
// const { hashSync } = require('bcryptjs')
// const { exist } = require('joi')
// const { identifyInfo } = require('../middlewares/identification')
const authService = require("../services/authService")

exports.singup = async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await authService.singup(email, password)

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }
        res.status(200).json({ success: true, message: result.message, result })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

exports.singin = async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await authService.singin(email, password)

        console.log(result)
        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        const token = result.token

        res.json({ success: true, token, message: result.message })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

exports.logout = async (req, res) => {
    const { email, loginToken } = req.body

    try {
        const result = await authService.logout(email, loginToken)
        if (!result.success) {
            res.status(400).json({ success: false, message: 'You login failed!' })
        }

        res.status(200).json({ success: true, message: 'Logout successfully!' })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body
    try {
        const result = await authService.sendVerificationCode(email)
        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }
        res.status(200).json({ success: true, message: 'Code sent successfully!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
}

exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body

    try {

        const result = await authService.sendVerificationCode(email, providedCode)

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: 'Code sent successfully!' })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

exports.sendChangePasswordCode = async (req, res) => {
    const { email, loginToken } = req.body

    try {

        const result = await authService.sendChangePasswordCode(email)

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

exports.verifyChangePasswordCode = async (req, res) => {
    const { email, providedCode, newPassword } = req.body

    try {

        const result = await authService.verifyChangePasswordCode(email, providedCode, newPassword)

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

exports.sendForgotPasswordCode = async (req, res) => {
    const { email } = req.body

    try {
        const result = await authService.sendForgotPasswordCode(email)

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

exports.verifyForgotPasswordCode = async (req, res) => {
    const { email, providedCode, newPassword } = req.body

    try {

        const result = await authService.verifyForgotPasswordCode(email, providedCode, newPassword)

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message })

    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}

exports.logInGoogle = async (req, res) => {
    try {
        const tokenPayload = req.tokenPayload

        const result = await authService.logInGoogle(tokenPayload)
        
        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message, token: result.token})
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
}