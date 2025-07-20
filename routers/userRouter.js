const express = require("express");

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.patch(
  "/:userId/update-profile",
  authMiddleware.authenticateUser,
  authMiddleware.authRole(["user", "author"]),
  userController.updateUserProfile
);
router.patch(
  "/:userId/favourites",
  authMiddleware.authenticateUser,
  userController.toggleFavouriteManga
);

router.patch(
  "/:userId/follow-author",
  authMiddleware.authenticateUser,
  userController.toggleFollowAuthor
);

router.post(
  "/:id/toggle-follow",
  authMiddleware.authenticateUser,
  userController.toggleFollow
);

router.get("/:id/followers", userController.getFollowers);

router.get("/:id/following", userController.getFollowing);

router.get("/:id/follow-stats", userController.getFollowStats);

module.exports = router;
