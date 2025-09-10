const express = require('express')

const groupController = require('../controllers/groupController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// Get
router.get('/', groupController.getAllGroup)
router.get('/notHide', groupController.getAllGroupNotHide)
router.get('/groupInfor', groupController.getAllInforOfGroup)
router.get('/:id', groupController.getGroupById)
// Post
router.post('/', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), groupController.addGroup)
// Patch
router.patch('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), groupController.updateGroup)
//  Delete
router.delete('/:id', authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), groupController.deleteGroup)

module.exports = router