const groupModel = require('../models/group');
const productModel = require('../models/product');

exports.addGroup = async (name, isHide, category) => {
    const existing = await groupModel.findOne({ name });
    if (existing) {
        return { success: false, message: "Tên group đã tồn tại!" };
    }

    const newGroup = new groupModel({
        name,
        isHide,
        category, // mảng ObjectId
    });

    await newGroup.save();

    return { success: true, group: newGroup };
};

exports.updateGroup = async (id, name, isHide, category) => {
    const updated = await groupModel.findByIdAndUpdate(
        id,
        { name, isHide, category },
        { new: true }
    );

    if (!updated) {
        return { success: false, message: "Không tìm thấy group để cập nhật!" };
    }

    return { success: true, group: updated };
};

exports.deleteGroup = async (id) => {
    const group = await groupModel.findById(id);
    if (!group) {
        return { success: false, message: "Không tìm thấy group để xoá!" };
    }

    const productExists = await productModel.findOne({
        category: { $in: group.category } // mảng category ID
    });

    if (productExists) {
        return {
            success: false,
            message: "Không thể xoá group vì vẫn còn sản phẩm thuộc category của group này!"
        };
    }

    await groupModel.findByIdAndDelete(id);
    return { success: true };
};

exports.getAllGroup = async () => {
    const groups = await groupModel.find().populate('category', 'name');

    if (groups.length === 0) {
        return { success: false, message: "Không tìm thấy group!" };
    }

    return { success: true, data: groups };
};

exports.getAllGroupNotHide = async () => {
    const groups = await groupModel.find({ isHide: false }).populate('category', 'name');

    if (groups.length === 0) {
        return { success: false, message: "Không tìm thấy group!" };
    }

    return { success: true, data: groups };
};

exports.getGroupById = async (id) => {
    const group = await groupModel.findById(id).populate('category', 'name');

    if (!group) {
        return { success: false, message: "Không tìm thấy group!" };
    }

    return { success: true, data: group };
};

exports.getAllInforOfGroup = async () => {
    // Lấy group không bị ẩn và populate category
    const groups = await groupModel
        .find({ isHide: false })
        .populate('category', '_id name');

    if (!groups.length) {
        return { success: false, message: "Không tìm thấy group!" };
    }

    const result = [];

    for (const group of groups) {
        const categoryIds = group.category.map(cat => cat._id);

        // Lấy tối đa 12 sản phẩm của tất cả category trong group
        const productsRaw = await productModel
            .find({ category: { $in: categoryIds } })
            .sort({ sellQuantity: -1 })
            .limit(12)
            .populate('category', 'name');

        const products = productsRaw.map(prod => ({
            _id: prod._id,
            name: prod.name,
            price: prod.price,
            image_url: prod.image_url,
            shortDescription: prod.shortDescription,
            sellQuantity: prod.sellQuantity,
            category_name: prod.category?.name || null
        }));

        result.push({
            group_name: group.name,
            products
        });
    }

    return {
        success: true,
        data: result
    };
};