const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/:id", commentController.getCommentByMangaById);
router.post('/manga/:mangaId', commentController.addComment);
router.patch('/like/:commentId', commentController.toggleLikeComment);
router.post('/report/:commentId', commentController.reportComment);
router.post('/chapter/:chapterId', commentController.addCommentToChapter);
router.get('/chapter/:chapterId', commentController.getCommentsByChapter);

module.exports = router;