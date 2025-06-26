const express = require('express')

const categoryController = require('../controllers/categoryController.js')

const router = express.Router()

router.get("/", categoryController.getAllCategory)

module.exports = router