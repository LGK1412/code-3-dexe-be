const commentService = require("../services/commentService");
const mongoose = require('mongoose');

exports.getCommentByMangaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await commentService.getCommentByMangaById(id);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      comments: result.comments,
      message: "Successfully retrieved comments!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

exports.addComment = async (req, res) => {
  let { mangaId } = req.params;
  let { userId, content } = req.body;
  try {
    // Ép kiểu ObjectId nếu là chuỗi
    if (mangaId && typeof mangaId === 'string') mangaId = new mongoose.Types.ObjectId(mangaId);
    if (userId && typeof userId === 'string') userId = new mongoose.Types.ObjectId(userId);
    const result = await commentService.addComment(mangaId, userId, content);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    return res.status(200).json({ success: true, comment: result.comment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

exports.toggleLikeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;
  try {
    const comment = await require('../models/comment.model').findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    // Tìm reaction của user
    const idx = comment.reactions.findIndex(r => r.userId.toString() === userId.toString() && r.type === 'like');
    if (idx === -1) {
      comment.reactions.push({ userId, type: 'like' });
    } else {
      comment.reactions.splice(idx, 1); // toggle like
    }
    await comment.save();
    // Đếm số like hiện tại
    const likeCount = comment.reactions.filter(r => r.type === 'like').length;
    res.json({ success: true, likeCount, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.reportComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, reason } = req.body;
  try {
    const comment = await require('../models/comment.model').findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    comment.reports.push({ user: userId, reason });
    await comment.save();
    res.json({ success: true, message: "Report sent!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addCommentToChapter = async (req, res) => {
  const { chapterId } = req.params;
  const { userId, content } = req.body;
  try {
    const comment = await require('../models/comment.model').create({
      chapterId: chapterId,
      userId: userId,
      content,
    });
    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.getCommentsByChapter = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const comments = await require('../models/comment.model').find({ chapterId: chapterId }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};