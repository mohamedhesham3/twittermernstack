const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Post = require("../models/PostSchema");
const Chatroom = require('./Chatroom');

const UserSchema = new Schema({
  Username: { type: String, required: true }, // Username is required
  Email: { type: String, required: true }, // Email is required
  Password: { type: String, required: true }, // Password is required
  Avatar: { type: String ,
     default: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/434px-Unknown_person.jpg"}, // Avatar is optional
  Bio:String ,

  Posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ], // Array of Post references
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of User references (followers)
  following: [{ type: Schema.Types.ObjectId }], // Array of User references (following)
  ChatRoom: [{ type: Schema.Types.ObjectId, ref: "Room" }], // Array of Room references
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }], // Array of Post references (bookmarks)
});

module.exports = mongoose.model("User", UserSchema);
