const EventEmitter = require("events");
const Notification = require("../models/notification.model");

class NotificationEmitter extends EventEmitter {}
const notificationEmitter = new NotificationEmitter();

// Khi ai đó like comment
notificationEmitter.on(
  "commentLiked",
  async ({ senderId, receiverId, commentId }) => {
    if (senderId.toString() === receiverId.toString()) return; // không gửi thông báo tự like

    try {
      // Kiểm tra xem đã có thông báo like comment này chưa
      const existing = await Notification.findOne({
        sender: senderId,
        receiver: receiverId,
        type: "like_comment",
        referenceId: commentId,
        isRead: false,
        createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60) }, // 1h
      });

      console.log("[DEBUG] Tìm thông báo đã tồn tại:", existing);

      if (existing) {
        // Nếu đã có rồi và chưa đọc → bỏ qua không tạo mới
        console.log("[NOTI] Đã tồn tại thông báo like chưa đọc, bỏ qua.");
        return;
      }

      // Tạo thông báo mới
      await Notification.create({
        sender: senderId,
        receiver: receiverId,
        type: "like_comment",
        content: "Ai đó đã thích bình luận của bạn.",
        referenceId: commentId,
      });

      console.log("[NOTI] Notification created for comment like");
    } catch (err) {
      console.error("Lỗi khi tạo thông báo:", err.message);
    }
  }
);

// Khi ai đó follow bạn
notificationEmitter.on("userFollowed", async ({ senderId, receiverId }) => {
  if (senderId.toString() === receiverId.toString()) return; // không tự follow

  try {
    // Kiểm tra đã từng gửi thông báo follow chưa
    const existing = await Notification.findOne({
      sender: senderId,
      receiver: receiverId,
      type: "follow",
    });

    if (existing) {
      console.log("[NOTI] Đã tồn tại thông báo follow, bỏ qua.");
      return;
    }

    await Notification.create({
      receiver: receiverId,
      sender: senderId,
      type: "follow",
      content: "đã theo dõi bạn.",
    });

    console.log("[NOTI] Notification created for follow");
  } catch (err) {
    console.error("Lỗi khi tạo thông báo follow:", err.message);
  }
});

module.exports = notificationEmitter;
