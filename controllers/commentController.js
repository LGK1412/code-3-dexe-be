const commentService = require("../services/commentService");

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
  const { mangaId } = req.params;
  const { userId, content } = req.body;
  try {
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
    const index = comment.likes.findIndex(id => id.toString() === userId);
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }
    await comment.save();
    res.json({ success: true, likes: comment.likes.length, liked: index === -1 });
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
      chapter: chapterId,
      user: userId,
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
    const comments = await require('../models/comment.model').find({ chapter: chapterId }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};