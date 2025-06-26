const categoryModel = require('../models/category.model')

exports.getAllCategory = async () => {
    const categories = await categoryModel.find()
    if (!categories) {
        return { success: false, message: "Lỗi không lấy được category!" }
    }

    return { success: true, categories: categories }
}