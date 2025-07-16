const imageService = require('../services/imageService');

exports.uploadAvatar = async (req, res) => {
    const { userId } = req.params
    try {
        const result = await imageService.generateAvatarUrl(req.file, userId);
        

        if (!result.success) {
            res.status(400).json({ success: false, message: result.message })
        }

        res.status(200).json({ success: true, url: result.avatarUrl })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
};
