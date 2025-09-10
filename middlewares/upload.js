const multer = require('multer')
const path = require('path')

// Bộ nhớ tạm, không lưu trực tiếp
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/')
    const isModel = file.originalname.endsWith('.glb')

    if (isImage || isModel) cb(null, true)
    else cb(new Error('Chỉ chấp nhận ảnh và file .glb'))
}

const upload = multer({ storage, fileFilter })

module.exports = upload
