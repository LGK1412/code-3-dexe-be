const express = require('express')

const styleController = require('../controllers/styleController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// Get
router.get('/', styleController.getAllStyle)
router.get('/notHide', styleController.getAllStyleNotHide)
router.get('/:id', styleController.getStyleById)
// Post
router.post('/', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), styleController.addStyle)
// Patch
router.patch('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), styleController.updateStyle)
//  Delete
router.delete('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), styleController.deleteStyle)

module.exports = router