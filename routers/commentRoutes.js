const express = require("express");
const router = express.Router();
const controller = require("../controllers/commentController");
const {
  authhenticateUser,
  authRole,
} = require("../middlewares/authMiddleware");

// Get comments for manga or chapter
router.get("/", controller.getComments);

// Get replies to a comment
router.get("/:id/replies", controller.getReplies);

// Post comment or reply
router.post("/", authhenticateUser, controller.createComment);

// Like or unlike comment
router.patch("/:id/like", authhenticateUser, controller.toggleLike);

// Delete comment (by owner or admin)
router.delete("/:id", authhenticateUser, controller.deleteComment);

// Admin hide/unhide
router.patch(
  "/:id/hide",
  authhenticateUser,
  authRole(["admin"]),
  controller.hideComment
);
router.patch(
  "/:id/unhide",
  authhenticateUser,
  authRole(["admin"]),
  controller.unhideComment
);

module.exports = router;
