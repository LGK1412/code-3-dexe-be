const express = require('express')

const testController = require('../controllers/testController')

const router = express.Router()

router.get('/test', testController.test)

router.get('/setCookieTest', testController.setCookieTest)
router.get('/checkCokieTest', testController.checkCokieTest)


module.exports = router