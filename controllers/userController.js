const userService = require('../services/userService')

exports.getAllUser = async (req, res) => {
    try {
        const result = await userService.getAllUser()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy user thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}