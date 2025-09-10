const express = require('express')

const policyController = require('../controllers/policyController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get("/", policyController.getPolicy)

router.patch("/update", authMiddleware.authenticateUser, authMiddleware.authRole(['admin']), policyController.updateAndAddPolicy)

module.exports = router