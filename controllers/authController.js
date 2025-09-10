const authService = require("../services/authService")

// ... các hàm trên giữ nguyên

exports.singup = async (req, res) => {
    const { email, password, dob } = req.body
    try {
        const result = await authService.singup(email, password, dob)

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
        const payload = req.body;

        const result = await authService.logInGoogle(payload)

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

exports.updateUserProfile = async (req, res) => {
    const { name, gender, dob, menh } = req.body
    const { userId } = req.params
    try {
        const result = await authService.updateUserProfile(userId, name, gender, dob, menh)

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }

        return res.json({ success: true, token: result.token, message: "Cập nhật thành công!" })
    } catch (error) {
        return res.status(500).json({ message: error.message || "Lỗi server" })
    }
}