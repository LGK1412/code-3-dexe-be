const usersModel = require("../models/users.model");
const jwt = require('jsonwebtoken')

exports.updateUserProfile = async (userId, name, gender, dob, role) => {
    try {
        if (!name) return { success: false, message: "Thiếu trường: họ tên" };
        if (!gender) return { success: false, message: "Thiếu trường: giới tính" };
        if (!dob) return { success: false, message: "Thiếu trường: ngày sinh" };
        if (!role) return { success: false, message: "Thiếu trường: role" };
        // Kiểm tra trùng tên (ngoại trừ user hiện tại)
        const existingName = await usersModel.findOne({ name, _id: { $ne: userId } });
        if (existingName) {
            return { success: false, message: "Tên này đã được sử dụng, vui lòng chọn tên khác" };
        }
        const updated = await usersModel.findByIdAndUpdate(
            userId,
            { name, gender, dob, role },
            { new: true }
        );
        if (!updated) return { success: false, message: "Không tìm thấy người dùng" };

        const token = jwt.sign({
            userId: updated._id,
            email: updated.email,
            verified: updated.verified,
            name: updated.name,
            gender: updated.gender,
            dob: updated.dob,
            avatar: updated.avatar,
            role: updated.role,
        }, process.env.TOKEN_SECRET, { expiresIn: '180d' });

        updated.loginToken = token;
        await updated.save();

        return { success: true, message: "Cập nhật hồ sơ thành công", token };
    } catch (err) {
        console.error("Lỗi khi cập nhật:", err.message);
        return { success: false, message: "Đã xảy ra lỗi trong quá trình cập nhật" };
    }
};

