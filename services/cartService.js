const cartModel = require('../models/cart')

exports.addToCart = async (userId, productId) => {
    let cart = await cartModel.findOne({ customer_id: userId });

    if (!cart) {
        cart = new cartModel({
            customer_id: userId,
            products: [{ product_id: productId, quantity: 1 }],
        });
    } else {
        const existingProduct = cart.products.find(
            item => item.product_id.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product_id: productId, quantity: 1 });
        }
    }

    await cart.save();
    return { success: true };
};

exports.decreaseFromCart = async (userId, productId) => {
    const cart = await cartModel.findOne({ customer_id: userId });
    if (!cart) return { success: false, message: "Không tìm thấy giỏ hàng!" };

    const item = cart.products.find(p => p.product_id.toString() === productId)
    if (!item) return { success: false, message: "Sản phẩm không có trong giỏ!" };

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart.products = cart.products.filter(p => p.product_id.toString() !== productId);
    }
    await cart.save();
    return { success: true };
};


exports.getCartByUser = async (userId) => {
    const cart = await cartModel.findOne({ customer_id: userId }).populate('products.product_id');
    // console.log(cart)
    if (!cart) return { success: false, message: "Không tìm thấy giỏ hàng!" };

    return { success: true, data: cart };
};

exports.removeFromCart = async (userId, productId) => {
    const cart = await cartModel.findOne({ customer_id: userId });
    if (!cart) return { success: false, message: "Không tìm thấy giỏ hàng!" };

    const existed = cart.products.some(p => p.product_id.toString() === productId);
    if (!existed) return { success: false, message: "Sản phẩm không có trong giỏ!" };

    cart.products = cart.products.filter(p => p.product_id.toString() !== productId);
    await cart.save();

    return { success: true };
};

exports.getAllCart = async () => {
    const cart = await cartModel.find().populate('products.product_id').populate('customer_id');

    if (!cart) return { success: false, message: "Không tìm thấy giỏ hàng!" };

    return { success: true, data: cart };
};

exports.getCartById = async (id) => {
    const cart = await cartModel.findOne({ _id: id }).populate('products.product_id').populate('customer_id');
    console.log(cart);

    if (!cart) return { success: false, message: "Không tìm thấy giỏ hàng!" };

    return { success: true, data: cart };
};