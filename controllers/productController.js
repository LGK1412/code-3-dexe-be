const productService = require('../services/productService')

exports.addProduct = async (req, res) => {
    console.log(req.body);
    
    const { name, description, menh_good, menh_bad, huong_good, huong_bad, color_good, color_bad, isHide, quantity, inStock, price, menh_main, color_main, category, shortDescription, style } = req.body
    try {
        const result = await productService.addProduct(name, description, menh_good, menh_bad, huong_good, huong_bad, color_good, color_bad, req.files, isHide, quantity, inStock, price, menh_main, color_main, category, shortDescription, style)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Add product thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params
    const { name, description, menh_good, menh_bad, huong_good, huong_bad, color_good, color_bad, isHide, quantity, inStock, price, menh_main, color_main, category, shortDescription, style } = req.body
    try {
        const result = await productService.updateProduct(id, name, description, menh_good, menh_bad, huong_good, huong_bad, color_good, color_bad, req.files, isHide, quantity, inStock, price, menh_main, color_main, category, shortDescription, style)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Update product thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllProduct = async (req, res) => {
    try {
        const result = await productService.getAllProduct()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy product thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllProductNotHide = async (req, res) => {
    try {
        const result = await productService.getAllProductNotHide()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy product thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await productService.getProductById(id)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy product thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const result = await productService.deleteProduct(id)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Xóa product thành công!" })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getBestSellerProduct = async (req, res) => {
    try {
        const result = await productService.getBestSellerProduct()
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy bestsell product thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}

exports.getAllProductForPhongThuy = async (req, res) => {
    const { userMenh } = req.body
    
    try {
        const result = await productService.getAllProductForPhongThuy(userMenh)
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy product thành công!", data: result.data })
        }
        return res.status(400).json({ success: false, message: result.message })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' })
    }
}