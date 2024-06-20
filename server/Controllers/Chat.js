const mongoose = require("mongoose");
const Chatschema = require("../models/Chatroom");
const User =require('../models/User')
const makechat = async (req, res) => {
     const { user1, user2 } = req.body;
   
     if (!user1 || !user2) {
       return res.status(400).json({ message: "Invalid user IDs" });
     }
   
     try {
       const existingChatRoom = await Chatschema.findOne({
         members: { $all: [user1, user2] } // Check if a chat room with these members already exists
       });
   
       if (existingChatRoom) {
         return res.status(200).json(existingChatRoom);
       }
   
       const newChatRoom = new Chatschema({
         members: [user1, user2] // Directly use user IDs in the array
       });
   
       await newChatRoom.save();
   
       // Add chat room reference to users
       await Promise.all([
         User.findByIdAndUpdate(user1, { $addToSet: { ChatRoom: newChatRoom._id } }),
         User.findByIdAndUpdate(user2, { $addToSet: { ChatRoom: newChatRoom._id } })
       ]);
   
       res.status(201).json(newChatRoom);
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Internal server error" });
     }
   };
   
   
   
    
   const getallrooms = async (req, res) => {
     const { userid } = req.params;
   
     try {
       const rooms = await Chatschema.find({
         $or: [{ "members": userid }, { "members": userid }]
       })
       .populate("members", "Username Avatar")
       .populate("messages.senderid", "Username Avatar");
   
       res.status(200).json(rooms);
     } catch (error) {
       console.error("Error fetching chat rooms:", error.message);
       res.status(500).json({ error: "Internal Server Error" });
     }
   };
   
   


const findroom = async (req, res) => {
  const { roomid } = req.params;
  try {
    const findRoom = await Chatschema.findById(roomid).populate("members.user1", "Username Avatar")
    .populate("members.user2", "Username Avatar")
    .populate("messages.senderid", "Username Avatar");
    if (!findRoom) {
      res.send("room not exist");
    }
    const roomidd = new Chatschema({
      RoomId: roomid,
    });
    res.send(findRoom);

    await roomidd.save();
  } catch (error) {
    console.log(error);
  }
};





const realtimechat = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");
  
    // Handle 'send_msg' event
    socket.on("send_msg", async (data) => {
      console.log("Received message:", data);
  
      try {
        const currentRoom = await Chatschema.findById(data.roomId);
  
        if (!currentRoom) {
          throw new Error("Chat room not found");
        }
  
        const currentUser = await User.findById(data.senderid);
  
        if (!currentUser) {
          throw new Error("User not found");
        }
  
        const messageData = {
          senderid: data.senderid,
          content: data.content,
          Avatar: currentUser.Avatar,
          Username: currentUser.Username,
        };
  
        // Add message to the chat room
        currentRoom.messages.push(messageData);
        await currentRoom.save();
  
        io.emit("receive_msg", messageData);
  
      } catch (error) {
        console.log("Error sending message:", error);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
  
    });
  });
}





module.exports = { makechat, findroom, getallrooms,realtimechat };
;
