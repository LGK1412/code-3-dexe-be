const categoryService = require('../services/categoryService')

exports.addCategory = async (req, res) => {
    const { name, isHide, description } = req.body
    try {
        const result = await categoryService.addCategory(name, isHide, description)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Thêm category thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.updateCategory = async (req, res) => {
    const { id } = req.params
    const { name, isHide, description } = req.body
    try {
        const result = await categoryService.updateCategory(id, name, isHide, description)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Update category thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const result = await categoryService.deleteCategory(id)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Delete category thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        const result = await categoryService.getAllCategory()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy category thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllCategoryNotHide = async (req, res) => {
    try {
        const result = await categoryService.getAllCategoryNotHide()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy category ko hide thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getCategoryById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await categoryService.getCategoryById(id)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy category thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}