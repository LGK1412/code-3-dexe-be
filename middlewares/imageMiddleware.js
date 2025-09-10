const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'assets/avatars/',
    filename: (req, file, cb) => {
        const { userId } = req.params
        const ext = path.extname(file.originalname);
        cb(null, `${userId}${ext}`);
    }
});

exports.upload = multer({ storage });

const thumbnailStorage = multer.diskStorage({
    destination: 'assets/thumbnailsManga/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        cb(null, fileName)
    },
})
exports.uploadThumbnail = multer({ storage: thumbnailStorage })


const chapterImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "assets/chapterImages/")
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
        cb(null, fileName)
    },
})

exports.uploadChapterImages = multer({
    storage: chapterImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Định dạng ảnh không hợp lệ"), false)
        }
    },
})