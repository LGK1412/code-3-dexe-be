// const mongoose = require("mongoose");

// const notificationSchema = mongoose.Schema(
//   {
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//       required: true,
//     },
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//     },
//     type: {
//       type: String,
//       enum: ["like_comment", "follow", "comment_reply", "system"],
//       required: true,
//     },
//     content: {
//       type: String,
//     },
//     referenceId: {
//       type: mongoose.Schema.Types.ObjectId, // tham chiếu đến comment / user / chapter...
//     },
//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("notifications", notificationSchema);

const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      type: String,
      enum: ["like_comment", "follow", "comment_reply", "system", "report"],
      required: true,
    },
    content: {
      type: String,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId, // tham chiếu đến comment / user / chapter...
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notifications", notificationSchema);
