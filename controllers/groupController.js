const groupService = require('../services/groupService');

exports.addGroup = async (req, res) => {
    const { name, isHide, category } = req.body;
    try {
        const result = await groupService.addGroup(name, isHide, category);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Thêm group thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.updateGroup = async (req, res) => {
    const { id } = req.params;
    const { name, isHide, category } = req.body;
    try {
        const result = await groupService.updateGroup(id, name, isHide, category);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Update group thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await groupService.deleteGroup(id);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Delete group thành công!" });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getAllGroup = async (req, res) => {
    try {
        const result = await groupService.getAllGroup();
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy group thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getAllGroupNotHide = async (req, res) => {
    try {
        const result = await groupService.getAllGroupNotHide();
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy group không hide thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getGroupById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await groupService.getGroupById(id);
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy group thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getAllInforOfGroup = async (req, res) => {
    try {
        const result = await groupService.getAllInforOfGroup();
        if (result.success) {
            return res.status(200).json({ success: true, message: "Lấy group thành công!", data: result.data });
        }
        return res.status(400).json({ success: false, message: result.message });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};