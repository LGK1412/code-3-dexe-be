// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/notificationController");
// const { authenticateUser } = require("../middlewares/authMiddleware");

// router.get("/", authenticateUser, controller.getNotifications);
// router.patch("/:id/read", authenticateUser, controller.markAsRead);

// module.exports = router;

const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateUser } = require("../middlewares/authMiddleware");

router.get("/", authenticateUser, notificationController.getNotifications);
router.patch("/:id/read", authenticateUser, notificationController.markAsRead);
router.delete(
  "/:id",
  authenticateUser,
  notificationController.deleteNotification
);

module.exports = router;
