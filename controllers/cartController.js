const cartService = require('../services/cartService')

exports.addToCart = async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const result = await cartService.addToCart(userId, productId);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Thêm giỏ hàng thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.decreaseFromCart = async (req, res) => {
    const { userId, productId } = req.body
    try {
        const result = await cartService.decreaseFromCart(userId, productId);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Giảm giỏ hàng thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
}


exports.getCartByUser = async (req, res) => {
    const { userId } = req.body
    try {
        const result = await cartService.getCartByUser(userId);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy giỏ hàng thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
}

exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body
    try {
        const result = await cartService.removeFromCart(userId, productId);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Xoá giỏ hàng thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
}

exports.getAllCart = async (req, res) => {
    try {
        const result = await cartService.getAllCart();
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy cart thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
}

exports.getCartById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await cartService.getCartById(id);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy cart thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
}