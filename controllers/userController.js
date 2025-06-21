const userService = require('../services/userServices')

exports.updateUserProfile = async (req, res) => {
    const { userId } = req.params
    const { name, gender, dob, role} = req.body

    try {
        const result = await userService.updateUserProfile(userId, name, gender, dob, role)
        
        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, message: result.message, result })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi kết nối server' })
    }
}