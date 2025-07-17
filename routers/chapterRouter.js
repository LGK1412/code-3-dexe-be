const express = require('express')
const chapterController = require('../controllers/chapterController')

const router = express.Router()

const { uploadChapterImages } = require('../middlewares/imageMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/:mangaId', authMiddleware.authhenticateUser, authMiddleware.authRole(["author"]), uploadChapterImages.array('images'), chapterController.addNewChapter)
router.get('/:mangaId', chapterController.getChapterByMangaId)

router.get('/get-chapter/:chapterId', chapterController.getChapterById)
router.delete('/:chapterId', authMiddleware.authhenticateUser, authMiddleware.authRole(["author"]), chapterController.deleteChapter)
router.patch('/:chapterId', authMiddleware.authhenticateUser, authMiddleware.authRole(["author"]), chapterController.updateChapter)

module.exports = router