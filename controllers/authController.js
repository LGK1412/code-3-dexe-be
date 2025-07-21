const authService = require("../services/authService")

// ... các hàm trên giữ nguyên

exports.singup = async (req, res) => {
    const { email, password } = req.body
    try {
        const result = await authService.singup(email, password)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }
        return res.status(200).json({ success: true, message: result.message, result })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Lỗi server" })
    }
}

exports.singin = async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await authService.singin(email, password)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        const token = result.token

        return res.json({ success: true, token, message: result.message })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Lỗi server" })
    }
}

exports.logout = async (req, res) => {
    const { email, loginToken } = req.body

    try {
        const result = await authService.logout(email, loginToken)
        if (!result.success) {
            return res.status(400).json({ success: false, message: 'You login failed!' })
        }

        return res.status(200).json({ success: true, message: 'Logout successfully!' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body

    try {
        const result = await authService.sendVerificationCode(email)
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }
        return res.status(200).json({ success: true, message: 'Gửi mã thành công!' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.verifyVerificationCode = async (req, res) => {
    const { email, providedCode } = req.body

    try {
        const result = await authService.verifyVerificationCode(email, providedCode)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: 'Xác thực thành công!' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.sendChangePasswordCode = async (req, res) => {
    const { email, loginToken } = req.body

    try {
        const result = await authService.sendChangePasswordCode(email)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.verifyChangePasswordCode = async (req, res) => {
    const { email, providedCode, newPassword } = req.body

    try {
        const result = await authService.verifyChangePasswordCode(email, providedCode, newPassword)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.sendForgotPasswordCode = async (req, res) => {
    const { email } = req.body

    try {
        const result = await authService.sendForgotPasswordCode(email)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.verifyForgotPasswordCode = async (req, res) => {
    const { email, providedCode, newPassword } = req.body

    try {
        const result = await authService.verifyForgotPasswordCode(email, providedCode, newPassword)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.logInGoogle = async (req, res) => {
    try {
        const tokenPayload = req.tokenPayload

        const result = await authService.logInGoogle(tokenPayload)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message, token: result.token })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.authorSingin = async (req, res) => {
    const { email, password } = req.body
    
    try {
        const result = await authService.authorSingin(email, password)
        
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        const token = result.token
        
        return res.status(200).json({ success: true, token, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}

exports.authorLogInGoogle = async (req, res) => {
    try {
        const tokenPayload = req.tokenPayload

        const result = await authService.authorLogInGoogle(tokenPayload)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.status(200).json({ success: true, message: result.message, token: result.token })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}
