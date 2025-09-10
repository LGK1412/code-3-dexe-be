const policyModel = require('../models/policy')

exports.getPolicy = async () => {
    const policy = await policyModel.find()

    if (!policy) return { success: false, message: "Không tìm thấy policy!" };

    return { success: true, data: policy };
}

exports.updateAndAddPolicy = async (content) => {
    try {
        // Lấy tất cả policy hiện có
        const policies = await policyModel.find();

        if (!policies || policies.length === 0) {
            // Nếu chưa có policy nào, tạo mới
            const newPolicy = await policyModel.create({ content });
            return { success: true, message: 'Tạo policy thành công!', data: newPolicy };
        } else {
            // Nếu đã có policy, update policy đầu tiên
            const policy = policies[0];
            policy.content = content;
            await policy.save();
            return { success: true, message: 'Cập nhật policy thành công!', data: policy };
        }
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Lỗi khi cập nhật/ thêm policy', error: err.message };
    }
};