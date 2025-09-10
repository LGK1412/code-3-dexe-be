const jwt = require('jsonwebtoken')
const { signinSchema, acceptChangePassCodeSchema } = require("../middlewares/validator")
const usersModel = require("../models/users")
const { doHasing, doHashValidation, hmacProcess } = require("../utils/hasing")
const transport = require('../middlewares/sendEmail')

function generateRandomUsername() {
    const letters = Math.random().toString(36).substring(2, 6) // random 4 chữ
    const numbers = Math.floor(Math.random() * 10000) // random 4 số
    return 'User - ' + letters + numbers
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

function formatDateToDMY(dateStr) {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
}

exports.singup = async (email, password, dob) => {
    const existingUser = await usersModel.findOne({ email: email })
    if (existingUser) {
        return { success: false, message: 'Email đã tồn tại!' }
    }

    const hashedPasswod = await doHasing(password, 12)

    const name = await generateUniqueUsername()

    const DOB = formatDateToDMY(dob)

    const newUser = new usersModel({
        email,
        password: hashedPasswod,
        name: name,
        dob: DOB
    })

    const result = await newUser.save()

    result.password = undefined

    return { success: true, message: 'Đăng ký thành công' }
}

exports.singin = async (email, password) => {
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
        name: existingUser.name,
        gender: existingUser.gender,
        dob: existingUser.dob,
        role: existingUser.role,
        menh: existingUser.menh
    }, process.env.TOKEN_SECRET, { expiresIn: '1d' })

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

exports.sendForgotPasswordCode = async (email) => {
    const existingUser = await usersModel.findOne({ email })

    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    const codeValue = Math.floor(Math.random() * 1000000).toString()

    let info = await transport.sendMail({
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: 'Mã OTP đổi mật khẩu của bạn',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #333;">Xin chào ${existingUser.name || ''},</h2>
      <p>Bạn đã yêu cầu đổi mật khẩu. Vui lòng sử dụng mã OTP bên dưới để xác nhận:</p>
      <h1 style="text-align: center; color: #ffffff; background-color: #4CAF50; padding: 10px 0; border-radius: 6px;">${codeValue}</h1>
      <p>Mã OTP có hiệu lực trong <strong>5 phút</strong>. Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    </div>
  `,
    });


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
        user = new usersModel({ name, email, avatar, googleId })
        await user.save()
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
        menh: user.menh
    }, process.env.TOKEN_SECRET, { expiresIn: '1d' })

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
    console.log(email)
    const token = jwt.sign({
        userId: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        gender: existingUser.gender,
        dob: existingUser.dob,
        role: existingUser.role,
        menh: existingUser.menh
    }, process.env.TOKEN_SECRET, { expiresIn: '1d' })

    existingUser.authorToken = token
    await existingUser.save()
    return { success: true, token }
}

exports.updateUserProfile = async (userId, name, gender, dob, menh) => {
    const existingUser = await usersModel.findById(userId)
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    // Update các field cho phép
    if (name !== undefined) existingUser.name = name
    if (gender !== undefined) existingUser.gender = gender
    if (dob !== undefined) existingUser.dob = dob
    if (menh !== undefined) existingUser.menh = menh

    await existingUser.save()

    // Tạo lại JWT mới với thông tin mới
    const token = jwt.sign({
        userId: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        gender: existingUser.gender,
        dob: existingUser.dob,
        role: existingUser.role,
        menh: existingUser.menh
    }, process.env.TOKEN_SECRET, { expiresIn: '1d' })

    return { success: true, token }
}
