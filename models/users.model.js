const { required, boolean } = require("joi");
const { verify } = require("jsonwebtoken");

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required!"],
      trim: true,
      unique: [true, "Email must be unique"],
      minLength: [5, "Email must be have 5 characters!"],
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      select: false,
    },
    verificationCodeValidation: {
      type: String,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
    loginToken: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: "avatar.png",
    },
    name: {
      type: String,
      required: [true, "Name must be provided!"],
    },
    isBan: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ["user", "admin", "author"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    dob: {
      type: String,
    },
    authorToken: {
      type: String,
      select: false,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
