const Notification = require("../models/notification.model");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar");

    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const noti = await Notification.findOneAndUpdate(
      { _id: id, receiver: userId },
      { isRead: true },
      { new: true }
    );

    if (!noti)
      return res
        .status(404)
        .json({ success: false, message: "Thông báo không tồn tại" });

    res.json({ success: true, message: "Đã đánh dấu là đã đọc" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
