const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ReactionSchema = new mongoose.Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["like", "dislike"],
      required: [true, "Reaction type is required"],
    },
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    mangaId: {
      type: Types.ObjectId,
      ref: "Manga",
      required: false, // Không bắt buộc nữa
      index: true,
    },
    chapterId: {
      type: Types.ObjectId,
      ref: "chapters",
      required: false, // Comment cho chapter
      index: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },
    reactions: { type: [ReactionSchema], default: [] },
    reports: [
      {
        user: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("Comment", CommentSchema);
