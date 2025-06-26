const categoryServices = require('../services/categoryService')

exports.getAllCategory = async (req, res) => {
    try {
        const result = await categoryServices.getAllCategory()

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message })
        }
        return res.status(200).json({ success: true, categories: result.categories })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Lỗi server" })
    }
}