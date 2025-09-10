const styleService = require('../services/styleService')

exports.addStyle = async (req, res) => {
    const { name, isHide, description } = req.body
    try {
        const result = await styleService.addStyle(name, isHide, description)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Thêm style thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.updateStyle = async (req, res) => {
    const { id } = req.params
    const { name, isHide, description } = req.body
    try {
        const result = await styleService.updateStyle(id, name, isHide, description)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Update style thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.deleteStyle = async (req, res) => {
    const { id } = req.params
    try {
        const result = await styleService.deleteStyle(id)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Delete style thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllStyle = async (req, res) => {
    try {
        const result = await styleService.getAllStyle()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy style thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllStyleNotHide = async (req, res) => {
    try {
        const result = await styleService.getAllStyleNotHide()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy style ko hide thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getStyleById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await styleService.getStyleById(id)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy style thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}