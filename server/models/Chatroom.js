const mongoose = require("mongoose");

// Define the schema for a chat room
const Chatschema = new mongoose.Schema({
  RoomId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      senderid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: String,
      Avatar: String,
      Username: String,
    },
  ],
});

// Export the mongoose model for the chat room
module.exports = mongoose.model("Room", Chatschema);
