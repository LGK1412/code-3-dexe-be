const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const testController = require('../controllers/testController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'avatars/'),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post('/upload-avatar', upload.single('image'), testController.uploadImage);

module.exports = router;
