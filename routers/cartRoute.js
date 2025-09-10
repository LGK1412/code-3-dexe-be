const express = require('express')

const router = express.Router()

const cartController = require('../controllers/cartController')

// GET
router.get('/', cartController.getAllCart)
router.post('/getCart', cartController.getCartByUser)
router.get('/:id', cartController.getCartById)
// POST
router.post('/', cartController.addToCart)
// PATCH
router.patch('/decrease', cartController.decreaseFromCart)
// DELETE
router.delete('/', cartController.removeFromCart);

module.exports = router