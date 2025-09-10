const express = require('express')

const productController = require('../controllers/productController')
const upload = require('../middlewares/upload')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// Get
router.get('/', productController.getAllProduct)
router.get('/notHide', productController.getAllProductNotHide)
router.get('/bestsell', productController.getBestSellerProduct)
router.post('/phongthuy', productController.getAllProductForPhongThuy)
router.get('/:id', productController.getProductById)
// Post
router.post('/', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), upload.fields([{ name: 'model', maxCount: 1 }, { name: 'images', maxCount: 10 }]), productController.addProduct)
// Patch
router.patch('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), upload.fields([{ name: 'model', maxCount: 1 }, { name: 'images', maxCount: 10 }]), productController.updateProduct)
// Delete
router.delete('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), productController.deleteProduct)


module.exports = router