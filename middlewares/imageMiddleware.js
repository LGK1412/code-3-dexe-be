const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'avatars/',
    filename: (req, file, cb) => {
        const { userId } = req.params
        const ext = path.extname(file.originalname);
        cb(null, `${userId}${ext}`);
    }
});

exports.upload = multer({ storage });
