const categoryModel = require('../models/category')
const productModel = require('../models/product')
const groupModel = require('../models/group');

exports.addCategory = async (name, isHide, description) => {
    const existing = await categoryModel.findOne({ name });
    if (existing) {
        return { success: false, message: "Tên category đã tồn tại!" };
    }

    const newCategory = new categoryModel({
        name,
        isHide,
        description,
    });

    await newCategory.save();

    return { success: true, category: newCategory };
};

exports.updateCategory = async (id, name, isHide, description) => {
    const updated = await categoryModel.findByIdAndUpdate(
        id,
        { name, isHide, description },
        { new: true }
    );

    if (!updated) {
        return { success: false, message: "Không tìm thấy category để cập nhật!" };
    }

    return { success: true };
};

exports.deleteCategory = async (id) => {
    const productExists = await productModel.findOne({ category: id });
    if (productExists) {
        return {
            success: false,
            message: "Không thể xoá category vì vẫn còn sản phẩm đang sử dụng!"
        };
    }

    // Xoá category khỏi tất cả group trước
    await groupModel.updateMany(
        { category: id },
        { $pull: { category: id } }
    );

    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
        return { success: false, message: "Không tìm thấy category để xoá!" };
    }

    return { success: true };
};

exports.getAllCategory = async () => {
    const categories = await categoryModel.find()

    if (categories.length === 0) {
        return { success: false, message: "Không tìm thấy category!" };
    }

    return { success: true, data: categories };
}

exports.getAllCategoryNotHide = async () => {
    const categories = await categoryModel.find({ isHide: false })

    if (categories.length === 0) {
        return { success: false, message: "Không tìm thấy category!" };
    }

    return { success: true, data: categories };
}

exports.getCategoryById = async (id) => {
    const category = await categoryModel.findById(id)

    if (!category) {
        return { success: false, message: "Không tìm thấy category!" };
    }

    return { success: true, data: category };
}