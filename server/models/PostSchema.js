const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    Caption: String,
    Image: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // This option will add createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("Post", PostSchema);
