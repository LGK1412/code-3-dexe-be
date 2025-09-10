const styleModel = require('../models/style')
const productModel = require('../models/product')

exports.addStyle = async (name, isHide, description) => {
    const existing = await styleModel.findOne({ name });    
    if (existing) {
        return { success: false, message: "Tên style đã tồn tại!" };
    }

    const newStyle = new styleModel({
        name,
        isHide,
        description,
    });

    await newStyle.save();

    return { success: true, style: newStyle };
};

exports.updateStyle = async (id, name, isHide, description) => {
    const updated = await styleModel.findByIdAndUpdate(
        id,
        { name, isHide, description },
        { new: true }
    );

    if (!updated) {
        return { success: false, message: "Không tìm thấy style để cập nhật!" };
    }

    return { success: true };
};

exports.deleteStyle = async (id) => {
    const productExists = await productModel.findOne({ style: id });
    if (productExists) {
        return {
            success: false,
            message: "Không thể xoá category vì vẫn còn sản phẩm đang sử dụng!"
        };
    }

    const deletedStyle = await styleModel.findByIdAndDelete(id);
    if (!deletedStyle) {
        return { success: false, message: "Không tìm thấy style để xoá!" };
    }

    return { success: true };
};

exports.getAllStyle = async () => {
    const styles = await styleModel.find()

    if (styles.length === 0) {
        return { success: false, message: "Không tìm thấy style!" };
    }

    return { success: true, data: styles };
}

exports.getAllStyleNotHide = async () => {
    const styles = await styleModel.find({ isHide: false })

    if (styles.length === 0) {
        return { success: false, message: "Không tìm thấy style!" };
    }

    return { success: true, data: styles };
}

exports.getStyleById = async (id) => {
    const style = await styleModel.findById(id)

    if (!style) {
        return { success: false, message: "Không tìm thấy style!" };
    }

    return { success: true, data: style };
}