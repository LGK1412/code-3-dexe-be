const usersModel = require('../models/users.model')

exports.generateAvatarUrl = async (file, userId) => {
    if (!file) {
        return { success: false, message: 'Không có ảnh được cập nhật!' }
    }

    const existingUser = await usersModel.findById({ _id: userId })
    if (!existingUser) {
        return { success: false, message: 'Người dùng không tồn tại!' }
    }

    existingUser.avatar = file.filename
    existingUser.save()

    return { success: true, avatarUrl: file.filename };
};
