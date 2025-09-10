const express = require('express')

const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()

// Get
router.get('/', categoryController.getAllCategory)
router.get('/notHide', categoryController.getAllCategoryNotHide)
router.get('/:id', categoryController.getCategoryById)
// Post
router.post('/', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), categoryController.addCategory)
// Patch
router.patch('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), categoryController.updateCategory)
//  Delete
router.delete('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), categoryController.deleteCategory)

module.exports = router