const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const imageMiddleware = require('../middlewares/imageMiddleware')

router.patch('/:userId/upload-avatar', imageMiddleware.upload.single('image'), imageController.uploadAvatar);

module.exports = router;
