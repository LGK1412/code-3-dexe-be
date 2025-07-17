const jwt = require('jsonwebtoken')
const { signupSchema, signinSchema, acceptCodeSchema, acceptLogoutSchema, changePasswordSchema, acceptChangePassCodeSchema } = require("../middlewares/validator")
const usersModel = require("../models/users.model")
const { doHasing, doHashValidation, hmacProcess } = require("../utils/hasing")
const transport = require('../middlewares/sendEmail')

function generateRandomUsername() {
    const letters = Math.random().toString(36).substring(2, 6) // random 4 chữ
    const numbers = Math.floor(Math.random() * 10000) // random 4 số
    return 'User' + letters + numbers
}

async function generateUniqueUsername() {
    let name
    let exists = true

    while (exists) {
        name = generateRandomUsername()
        const user = await usersModel.findOne({ name })
        if (!user) {
            exists = false
        }
    }

    return name
}



exports.singup = async (email, password) => {

    const { error, value } = signupSchema.validate({ email, password })
    if (error) {
        return { success: false, message: error.details[0].message }
    }

    const existingUser = await usersModel.findOne({ email: email })
    if (existingUser) {
        return { success: false, message: 'Email đã tồn tại!' }
    }

    const hashedPasswod = await doHasing(password, 12)

    const name = await generateUniqueUsername()

    const newUser = new usersModel({
        email,
        password: hashedPasswod,
        name: name
    })

    const result = await newUser.save()

    result.password = undefined

    return { success: true, message: 'Đăng ký thành công' }
}

exports.singin = async (email, password) => {

    const { error, value } = signinSchema.validate({ email, password })
    if (error) {
        return { success: false, message: error.details[0].message }
    }

    const existingUser = await usersModel.findOne({ email }).select('+password +googleId')
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại. Vui lòng đăng ký!' }
    }

    if (existingUser.googleId) {
        return { success: false, message: 'Vui lòng đăng nhập bằng Google Account!' }
    }

    const result = await doHashValidation(password, existingUser.password)
    if (!result) {
        return { success: false, message: 'Mật khẩu không hợp lệ!' }
    }

    const token = jwt.sign({
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
        name: existingUser.name,
        gender: existingUser.gender,
        dob: existingUser.dob,
        avatar: existingUser.avatar,
        role: existingUser.role,
    }, process.env.TOKEN_SECRET, { expiresIn: '180d' })

    existingUser.loginToken = token
    await existingUser.save()
    return { success: true, token }
}

exports.logout = async (email, loginToken) => {

    const existingUser = await usersModel.findOne({ email })
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    existingUser.loginToken = undefined
    existingUser.save()

    return { success: true }
}

exports.sendVerificationCode = async (email) => {

    const existingUser = await usersModel.findOne({ email })
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }
    if (existingUser.verified) {
        return { success: false, message: 'Người dùng không được xác minh!' }
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    let info = await transport.sendMail({
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: 'Verification code',
        html: '<h1>' + codeValue + '</h1>',
    })

    if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)
        existingUser.verificationCode = hashedCodeValue
        existingUser.verificationCodeValidation = Date.now()
        await existingUser.save()
        return { success: true, message: 'Đã gửi mã!' }
    }

    return { success: false, message: 'Gửi mã thất bại!' }
}

exports.verifyVerificationCode = async (email, providedCode) => {

    const { error, value } = acceptCodeSchema.validate({ email, providedCode })

    if (error) {
        return { success: false, message: error.details[0].message }
    }

    const codeValue = providedCode.toString()

    const existingUser = await usersModel.findOne({ email }).select('+verificationCode +verificationCodeValidation')

    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    if (existingUser.verified) {
        return { success: false, message: 'Người dùng đã được xác minh!' }
    }

    if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
        return { success: false, message: 'Có gì đó không ổn với mã này!' }
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
        return { success: false, message: 'Mã đã hết hạn!' }
    }

    const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)

    if (hashedCodeValue === existingUser.verificationCode) {
        existingUser.verified = true
        existingUser.verificationCode = undefined
        existingUser.verificationCodeValidation = undefined
        await existingUser.save()
        return { success: true, message: 'Tài khoản của bạn đã được xác minh!' }
    }

    return { success: false, message: 'Có gì đó không ổn!' }
}

exports.sendChangePasswordCode = async (email) => {
    const existingUser = await usersModel.findOne({ email })

    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    if (!existingUser.verified) {
        return { success: false, message: 'Người dùng chưa được xác minh!' }
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString()

    let info = await transport.sendMail({
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: 'Change password code',
        html: '<h1>' + codeValue + '</h1>',
    })

    if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)
        existingUser.forgotPasswordCode = hashedCodeValue
        existingUser.forgotPasswordCodeValidation = Date.now()
        await existingUser.save()
        return { success: true, message: 'Đã gửi mã!' }
    }

    return { success: false, message: 'Gửi mã thất bại!' }
}

exports.verifyChangePasswordCode = async (email, providedCode, newPassword) => {

    const { error, value } = acceptChangePassCodeSchema.validate({ email, providedCode, newPassword })
    if (error) {
        return { success: false, message: error.details[0].message }
    }

    const codeValue = providedCode.toString()

    const existingUser = await usersModel.findOne({ email }).select('+forgotPasswordCode +forgotPasswordCodeValidation +password')


    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
        return { success: false, message: 'Có gì đó không ổn với mã này!' }
    }

    if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
        return { success: false, message: 'Mã đã hết hạn!' }
    }

    const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)

    const hashedPasswod = await doHasing(newPassword, 12)

    if (hashedCodeValue === existingUser.forgotPasswordCode) {
        existingUser.forgotPasswordCode = undefined
        existingUser.forgotPasswordCodeValidation = undefined
        existingUser.password = hashedPasswod
        existingUser.loginToken = undefined
        await existingUser.save()
        return { success: true, message: 'Mật khẩu của bạn đã được thay đổi!' }
    }

    return { success: false, message: 'Có gì đó không ổn!' }
}

exports.sendForgotPasswordCode = async (email) => {
    const existingUser = await usersModel.findOne({ email })

    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    if (!existingUser.verified) {
        return { success: false, message: 'Người dùng chưa được xác minh!' }
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString()

    let info = await transport.sendMail({
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: 'Change password code',
        html: '<h1>' + codeValue + '</h1>',
    })

    if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)
        existingUser.forgotPasswordCode = hashedCodeValue
        existingUser.forgotPasswordCodeValidation = Date.now()
        await existingUser.save()
        return { success: true, message: 'Đã gửi mã!' }
    }

    return { success: true, message: 'Gửi mã thất bại!' }
}

exports.verifyForgotPasswordCode = async (email, providedCode, newPassword) => {

    const { error, value } = acceptChangePassCodeSchema.validate({ email, providedCode, newPassword })

    if (error) {
        return { success: false, message: error.details[0].message }
    }

    const codeValue = providedCode.toString()

    const existingUser = await usersModel.findOne({ email }).select('+forgotPasswordCode +forgotPasswordCodeValidation +password')


    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
        return { success: false, message: 'Có gì đó không ổn với mã này!' }
    }

    if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
        return { success: false, message: 'Mã đã hết hạn!' }
    }

    const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET)

    const hashedPasswod = await doHasing(newPassword, 12)

    if (hashedCodeValue === existingUser.forgotPasswordCode) {
        existingUser.forgotPasswordCode = undefined
        existingUser.forgotPasswordCodeValidation = undefined
        existingUser.password = hashedPasswod
        existingUser.loginToken = undefined
        await existingUser.save()
        return { success: true, message: 'Mật khẩu của bạn đã được thay đổi!' }
    }

    return { success: false, message: 'Có gì đó không ổn!' }
}

exports.logInGoogle = async (tokenPayload) => {
    // console.log(tokenPayload)
    const { name, email, picture: avatar, sub: googleId, email_verified } = tokenPayload

    if (!email_verified) {
        return { success: false, message: 'Xác thực email thất bại!' }
    }
    let user = await usersModel.findOne({ email }).select("+googleId")
    // console.log(user)
    if (user) {
        if (googleId !== user.googleId || !googleId) {
            return { success: false, message: 'Tài khoản này không đăng nhập bằng google' }
        }
    } else {
        user = new usersModel({ name, email, avatar, googleId, verified: true })
        await user.save()
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email,
        verified: user.verified,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar,
        role: user.role,
    }, process.env.TOKEN_SECRET, { expiresIn: '180d' })

    if (!token) {
        return {
            success: false,
            message: "Lỗi server"
        }
    }

    user.loginToken = token

    await user.save()

    return {
        success: true,
        message: user ? "Đăng nhập thành công!" : "Đăng ký thành công!",
        token
    }
}

exports.authorSingin = async (email, password) => {

    const { error, value } = signinSchema.validate({ email, password })
    if (error) {
        return { success: false, message: error.details[0].message }
    }

    const existingUser = await usersModel.findOne({ email }).select('+password +googleId')
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại. Vui lòng đăng ký!' }
    }

    if (existingUser.role !== 'author') {
        return { success: false, message: 'Vui lòng chuyển thành Tác Giả!' }
    }

    if (existingUser.googleId) {
        return { success: false, message: 'Vui lòng đăng nhập bằng Goolge Account!' }
    }

    const result = await doHashValidation(password, existingUser.password)
    if (!result) {
        return { success: false, message: 'Mật khẩu không hợp lệ!' }
    }

    const token = jwt.sign({
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
        name: existingUser.name,
        gender: existingUser.gender,
        dob: existingUser.dob,
        avatar: existingUser.avatar,
        role: existingUser.role,
    }, process.env.TOKEN_SECRET, { expiresIn: '1d' })

    existingUser.authorToken = token
    await existingUser.save()
    return { success: true, token }
}

exports.authorLogInGoogle = async (tokenPayload) => {
    const { email, sub: googleId, email_verified } = tokenPayload

    if (!email_verified) {
        return { success: false, message: 'Xác thực email thất bại!' }
    }

    const existingUser = await usersModel.findOne({ email }).select('+googleId')
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại. Vui lòng đăng ký trên App!' }
    }

    if (existingUser.role !== 'author') {
        return { success: false, message: 'Vui lòng chuyển thành Tác Giả!' }
    }

    if (googleId !== existingUser.googleId) {
        return { success: false, message: 'Có lỗi xảy ra với tài khoản Google' }
    }

    const token = jwt.sign({
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
        name: existingUser.name,
        gender: existingUser.gender,
        dob: existingUser.dob,
        avatar: existingUser.avatar,
        role: existingUser.role,
    }, process.env.TOKEN_SECRET, { expiresIn: '1d' })

    existingUser.authorToken = token
    await existingUser.save()

    return {
        success: true,
        message: "Đăng nhập thành công!",
        token
    }
}