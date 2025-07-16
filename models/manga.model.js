const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const mangaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Manga name is required"],
      maxlength: 300,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ongoing", "completed", "hiatus"],
        message: "{VALUE} is not a valid status",
      },
      default: "ongoing",
    },
    image: {
      type: String,
      validate: {
        validator: (url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url),
        message: "Invalid image URL",
      },
    },
    categories: {
      type: [Types.ObjectId],
      ref: "categories",
      required: [true, "At least one category is required"],
      index: true,
      default: [],
    },
    rating: {
      type: [Number],
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      default: [],
    },
    author: {
      type: Types.ObjectId,
      ref: "users",
      required: [true, "Author ID is required"],
      index: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Number,
      default: 0,
      min: [0, "View count cannot be negative"],
    },
    reports: [
      {
        user: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
        reason: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// Virtual for average rating
mangaSchema.virtual("averageRating").get(function () {
  if (!this.rating.length) return 0;
  return this.rating.reduce((sum, val) => sum + val, 0) / this.rating.length;
});

// Text index for search
mangaSchema.index({ name: "text", description: "text" });

// Soft delete middleware
mangaSchema.pre("find", function () {
  this.where({ isDelete: false });
});
mangaSchema.pre("findOne", function () {
  this.where({ isDelete: false });
});

module.exports = mongoose.model("mangas", mangaSchema);
