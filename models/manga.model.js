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
    },
    categories: {
      type: [Types.ObjectId],
      ref: "categories",
      required: [true, "At least one category is required"],
      index: true,
      default: [],
    },
    rating: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      value: { type: Number, min: 1, max: 5 }
    }],
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
  return this.rating.reduce((sum, r) => sum + r.value, 0) / this.rating.length;
});

mangaSchema.virtual("voteCount").get(function () {
  return this.rating.length;
});


module.exports = mongoose.model("mangas", mangaSchema);
