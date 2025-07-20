const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const { authenticateUser } = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, controller.getNotifications);
router.patch("/:id/read", authenticateUser, controller.markAsRead);

module.exports = router;
