const express = require('express')
const router = express.Router()

const mangaController = require('../controllers/mangaController')

const authMiddleware = require('../middlewares/authMiddleware')
const imageMiddleware = require('../middlewares/imageMiddleware')

router.post('/', imageMiddleware.uploadThumbnail.single('image'), authMiddleware.authhenticateUser, authMiddleware.authRole(["author"]), mangaController.addNewManga)
router.get('/', mangaController.getAllManga)
router.get('/:id', mangaController.getMangaById)
router.put('/:id', imageMiddleware.uploadThumbnail.single('image'), authMiddleware.authhenticateUser, authMiddleware.authRole(["author"]), mangaController.updateManga)
router.delete('/:id', authMiddleware.authhenticateUser, authMiddleware.authRole(["author"]), mangaController.deleteManga)

router.get('/author/:authorId', mangaController.getAllManga)

module.exports = router