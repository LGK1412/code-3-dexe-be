const express = require('express')

const userController = require('../controllers/userController')

const router = express.Router()

// Get
router.get('/', userController.getAllUser)

module.exports = router