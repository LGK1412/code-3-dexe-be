const Comment = require("../models/comment.model");
const notificationEmitter = require("../events/notification.events");

// user / author tạo comment cho manga / chapter
exports.createComment = async ({
  author,
  content,
  mangaId,
  chapterId,
  parentId,
}) => {
  if (!content) {
    throw new Error("Content is required.");
  }

  const newComment = new Comment({ content, author });

  // Nếu comment cha (reply)
  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) throw new Error("Comment cha không tồn tại.");

    newComment.parent = parentId;
    newComment.manga = parentComment.manga;
    newComment.chapter = parentComment.chapter;
  } else {
    // Nếu là comment chính (gửi cho manga hoặc chapter)
    if (mangaId) newComment.manga = mangaId;
    if (chapterId) newComment.chapter = chapterId;
    if (!mangaId && !chapterId) {
      throw new Error("Phải có mangaId hoặc chapterId nếu không phải reply.");
    }
  }

  const savedComment = await newComment.save();
  // Gửi thông báo
  // Nếu là reply thì gửi notification cho người tạo comment cha
  if (parentId && parentComment.author.toString() !== author.toString()) {
    notificationEmitter.emit("commentReplied", {
      senderId: author,
      receiverId: parentComment.author,
      commentId: newComment._id,
    });
  }
  return savedComment;
};

exports.getCommentsByTarget = async ({ mangaId, chapterId }) => {
  const query = mangaId ? { manga: mangaId } : { chapter: chapterId };

  return await Comment.find({
    ...query,
    parentComment: null,
    isDeleted: false,
    isHidden: false,
  })
    .populate("author", "name avatar role")
    .populate({
      path: "replies",
      match: { isDeleted: false },
      populate: { path: "author", select: "name avatar role" },
    })
    .sort({ createdAt: -1 });
};

// Tìm các comment con
exports.getReplies = async (parentCommentId) => {
  return await Comment.find({
    parentComment: parentCommentId,
    isDeleted: false,
  })
    .populate("author", "name avatar role")
    .sort({ createdAt: 1 });
};

// Like comment
exports.toggleLikeComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment không tồn tại!");

  const likedIndex = comment.likes.indexOf(userId);

  if (likedIndex === -1) {
    // Chưa like → like
    comment.likes.push(userId);
  } else {
    // Đã like → unlike
    comment.likes.splice(likedIndex, 1);
  }

  await comment.save();
  // Gửi thông báo
  if (comment.author.toString() !== userId.toString()) {
    notificationEmitter.emit("commentLiked", {
      senderId: userId,
      receiverId: comment.author,
      commentId: comment._id,
    });
  }
  return comment;
};

// Xóa mềm comment
exports.softDeleteComment = async (commentId, userId, role) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new Error("Comment not found");

  const isOwner = comment.author.toString() === userId.toString();
  const isAdmin = role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Not authorized to delete this comment");
  }

  // Xóa mềm comment chính
  comment.isDeleted = true;
  await comment.save();

  // Xóa mềm các reply
  await Comment.updateMany(
    { parent: commentId },
    { $set: { isDeleted: true } }
  );

  return true;
};

// Admin bỏ ẩn
exports.adminUnhideComment = async (commentId) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    { isHidden: false },
    { new: true }
  );
};
