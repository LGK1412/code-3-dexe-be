const userModel = require('../models/users')

exports.getAllUser = async () => {
    const users = await userModel.find({}, 'email name role gender dob menh');

    if (users.length === 0) {
        return { success: false, message: "Không tìm thấy user!" };
    }

    return { success: true, data: users };
};