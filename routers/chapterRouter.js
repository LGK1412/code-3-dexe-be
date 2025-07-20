const express = require("express");
const chapterController = require("../controllers/chapterController");

const router = express.Router();

const { uploadChapterImages } = require("../middlewares/imageMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/:mangaId",
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["author"]),
  uploadChapterImages.array("images"),
  chapterController.addNewChapter
);
router.get("/:mangaId", chapterController.getChapterByMangaId);
router.get(
  "/manga/:mangaId/chapter/:chapterNumber",
  chapterController.getChapterData
);
router.get("/get-chapter/:chapterId", chapterController.getChapterById);
router.delete(
  "/:chapterId",
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["author"]),
  uploadChapterImages.array("images"),
  chapterController.deleteChapter
);
router.patch(
  "/:chapterId",
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["author"]),
  uploadChapterImages.array("images"),
  chapterController.updateChapter
);

module.exports = router;
