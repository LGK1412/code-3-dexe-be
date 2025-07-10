const commentService = require("../services/commentService");

exports.createComment = async (req, res) => {
  try {
    const { content, mangaId, chapterId, parentId } = req.body;
    const author = req.user.userId;

    const comment = await commentService.createComment({
      content,
      author,
      mangaId,
      chapterId,
      parentId,
    });
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { mangaId, chapterId } = req.query;

    const comments = await commentService.getCommentsByTarget({
      mangaId,
      chapterId,
    });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReplies = async (req, res) => {
  try {
    const { id } = req.params;
    const replies = await commentService.getReplies(id);
    res.status(200).json({ success: true, replies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const updatedComment = await commentService.toggleLikeComment(id, userId);

    res.status(200).json({
      success: true,
      message: "Đã cập nhật trạng thái like.",
      likes: updatedComment.likes,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    await commentService.softDeleteComment(id, userId, role);

    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

exports.hideComment = async (req, res) => {
  try {
    const { id } = req.params;
    await commentService.adminHideComment(id);
    res.status(200).json({ success: true, message: "Comment hidden" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unhideComment = async (req, res) => {
  try {
    const { id } = req.params;
    await commentService.adminUnhideComment(id);
    res.status(200).json({ success: true, message: "Comment unhidden" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
