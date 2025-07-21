// const EventEmitter = require("events");
// const Notification = require("../models/notification.model");

// class NotificationEmitter extends EventEmitter {}
// const notificationEmitter = new NotificationEmitter();

// // Khi ai đó like comment
// notificationEmitter.on(
//   "commentLiked",
//   async ({ senderId, receiverId, commentId }) => {
//     if (senderId.toString() === receiverId.toString()) return; // không gửi thông báo tự like

//     try {
//       // Kiểm tra xem đã có thông báo like comment này chưa
//       const existing = await Notification.findOne({
//         sender: senderId,
//         receiver: receiverId,
//         type: "like_comment",
//         referenceId: commentId,
//         isRead: false,
//         createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60) }, // 1h
//       });

//       console.log("[DEBUG] Tìm thông báo đã tồn tại:", existing);

//       if (existing) {
//         // Nếu đã có rồi và chưa đọc → bỏ qua không tạo mới
//         console.log("[NOTI] Đã tồn tại thông báo like chưa đọc, bỏ qua.");
//         return;
//       }

//       // Tạo thông báo mới
//       await Notification.create({
//         sender: senderId,
//         receiver: receiverId,
//         type: "like_comment",
//         content: "Ai đó đã thích bình luận của bạn.",
//         referenceId: commentId,
//       });

//       console.log("[NOTI] Notification created for comment like");
//     } catch (err) {
//       console.error("Lỗi khi tạo thông báo:", err.message);
//     }
//   }
// );

// // Khi ai đó follow bạn
// notificationEmitter.on("userFollowed", async ({ senderId, receiverId }) => {
//   if (senderId.toString() === receiverId.toString()) return; // không tự follow

//   try {
//     // Kiểm tra đã từng gửi thông báo follow chưa
//     const existing = await Notification.findOne({
//       sender: senderId,
//       receiver: receiverId,
//       type: "follow",
//     });

//     if (existing) {
//       console.log("[NOTI] Đã tồn tại thông báo follow, bỏ qua.");
//       return;
//     }

//     await Notification.create({
//       receiver: receiverId,
//       sender: senderId,
//       type: "follow",
//       content: "đã theo dõi bạn.",
//     });

//     console.log("[NOTI] Notification created for follow");
//   } catch (err) {
//     console.error("Lỗi khi tạo thông báo follow:", err.message);
//   }
// });

// module.exports = notificationEmitter;

const EventEmitter = require("events");
const Notification = require("../models/notification.model");

class NotificationEmitter extends EventEmitter {}
const notificationEmitter = new NotificationEmitter();

// ========== Helper ==========

/**
 * Kiểm tra xem đã có notification tương tự trong khoảng thời gian gần đây chưa
 */
async function isDuplicateNotification({
  sender,
  receiver,
  type,
  referenceId,
  withinMs = 3600000,
}) {
  return await Notification.findOne({
    sender,
    receiver,
    type,
    referenceId,
    isRead: false,
    createdAt: { $gte: new Date(Date.now() - withinMs) },
  });
}

/**
 * Tạo thông báo nếu chưa tồn tại hoặc không bị trùng
 */
async function createNotification({
  sender,
  receiver,
  type,
  content,
  referenceId,
  skipIfDuplicate = true,
}) {
  if (sender?.toString() === receiver?.toString()) return; // không tự tương tác với chính mình

  if (skipIfDuplicate) {
    const existing = await isDuplicateNotification({
      sender,
      receiver,
      type,
      referenceId,
    });
    if (existing) {
      console.log(`[NOTI] Thông báo '${type}' đã tồn tại gần đây, bỏ qua.`);
      return;
    }
  }

  await Notification.create({ sender, receiver, type, content, referenceId });
  console.log(`[NOTI] Tạo thông báo '${type}' thành công.`);
}

// ========== Events ==========

// 1. Like Comment
notificationEmitter.on(
  "commentLiked",
  async ({ senderId, receiverId, commentId }) => {
    await createNotification({
      sender: senderId,
      receiver: receiverId,
      type: "like_comment",
      content: "đã thích bình luận của bạn.",
      referenceId: commentId,
    });
  }
);

// 2. Follow User
notificationEmitter.on("userFollowed", async ({ senderId, receiverId }) => {
  // Follow thường chỉ cần gửi 1 lần duy nhất → không cần giới hạn trong 1 giờ
  await createNotification({
    sender: senderId,
    receiver: receiverId,
    type: "follow",
    content: "đã theo dõi bạn.",
    skipIfDuplicate: true, // chỉ gửi 1 lần
  });
});

// 3. Report Comment
notificationEmitter.on(
  "contentReported",
  async ({ senderId, receiverId, commentId, reason }) => {
    if (!receiverId || !commentId) return;

    await createNotification({
      sender: senderId,
      receiver: receiverId,
      type: "report",
      content: `Bình luận của bạn đã bị báo cáo: ${reason}`,
      referenceId: commentId,
    });
  }
);

module.exports = notificationEmitter;
