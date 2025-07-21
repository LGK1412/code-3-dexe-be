const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;


const chapterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Chapter name is required"],
      maxlength: 150,
      trim: true,
    },
    image: [
      {
        type: String,
        required: [true, "Image URL is required"],
        validate: {
          validator: (url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url),
          message: "Invalid image URL",
        },
      },
    ],
    content: { type: String, trim: true },
    isFree: { type: Boolean, default: false },
    mangaId: {
      type: Types.ObjectId,
      ref: "mangas",
      required: [true, "Manga ID is required"],
      index: true,
    },
    chapterNumber: {
      type: Number,
      required: [true, "Chapter number is required"],
      min: [1, "Chapter number must be at least 1"],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for sorting by recency
chapterSchema.index({ createdAt: -1 });

// Soft delete middleware
chapterSchema.pre("find", function () {
  this.where({ isDelete: false });
});
chapterSchema.pre("findOne", function () {
  this.where({ isDelete: false });
});

module.exports = mongoose.model("chapters", chapterSchema);
