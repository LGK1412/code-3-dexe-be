const { Types } = require("mongoose");
const commentModel = require("../models/comment.model");

exports.getCommentByMangaById = async (mangaId) => {
  // 1) validate the ID
  if (!Types.ObjectId.isValid(mangaId)) {
    return { success: false, message: "Invalid manga ID" };
  }

  // 2) query on the correct field
  const comments = await commentModel
    .find({ mangaId }) // ← use mangaId, not _mangaId
    .sort({ createdAt: -1 });

  if (comments.length === 0) {
    return { success: false, message: "No comments found for this manga" };
  }

  return { success: true, comments };
};

exports.addComment = async (mangaId, userId, content) => {
  try {
    const comment = await require('../models/comment.model').create({ manga: mangaId, user: userId, content });
    return { success: true, comment };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
