const policyService = require('../services/policyService')

exports.updateAndAddPolicy = async (req, res) => {
    const { content } = req.body;
    try {
        const result = await policyService.updateAndAddPolicy(content);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Thêm policy thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getPolicy = async (req, res) => {
    try {
        const result = await policyService.getPolicy();
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy policy thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
}
