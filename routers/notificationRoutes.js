const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const { authhenticateUser } = require("../middlewares/authMiddleware");

router.get("/", authhenticateUser, controller.getNotifications);
router.patch("/:id/read", authhenticateUser, controller.markAsRead);

module.exports = router;
