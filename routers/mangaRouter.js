const express = require("express");
const router = express.Router();

const mangaController = require("../controllers/mangaController");

const authMiddleware = require("../middlewares/authMiddleware");
const imageMiddleware = require("../middlewares/imageMiddleware");

router.post(
  "/",
  imageMiddleware.uploadThumbnail.single("image"),
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["author"]),
  mangaController.addNewManga
);
router.get("/", mangaController.getMangaData);
router.get("/:id", mangaController.getMangaDetail);
router.put(
  "/:id",
  imageMiddleware.uploadThumbnail.single("image"),
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["author"]),
  mangaController.updateManga
);
router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["author"]),
  mangaController.deleteManga
);

router.post(
  "/:id/rate",
  authMiddleware.authenticateUser,
  mangaController.rateManga
);

router.post('/report/:id', mangaController.reportManga);

router.get("/author/:authorId", mangaController.getAllManga);

module.exports = router;
