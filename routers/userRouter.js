const express = require('express')

const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.patch('/:userId/update-profile',authMiddleware.authhenticateUser, authMiddleware.authRole(['user','author']), userController.updateUserProfile)

module.exports = router