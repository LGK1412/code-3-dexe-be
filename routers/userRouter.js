const express = require("express");
const {
  authhenticateUser,
  authRole,
} = require("../middlewares/authMiddleware");

const userController = require("../controllers/userController");

const router = express.Router();

router.patch(
  "/:userId/update-profile",
  authhenticateUser,
  authRole(["user", "author"]),
  userController.updateUserProfile
);

router.post(
  "/:id/toggle-follow",
  authhenticateUser,
  userController.toggleFollow
);

router.get("/:id/followers", userController.getFollowers);

router.get("/:id/following", userController.getFollowing);

router.get("/:id/follow-stats", userController.getFollowStats);

module.exports = router;
