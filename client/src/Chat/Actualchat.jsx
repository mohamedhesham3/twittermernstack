import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Api from '../API/Api';
import '../index.css';
import { jwtDecode } from "jwt-decode";

const Actualchat = () => {
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userid = decoded ? decoded.userid : null;

  useEffect(() => {
    const newSocket = io("https://twittermernstack.onrender.com/");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_msg", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_msg");
    };
  }, [socket]);

  useEffect(() => {
    const fetchChatContent = async () => {
      if (!roomId) return;

      try {
        const res = await Api.get(`/chat/${roomId}`);
        setMessages(res.data.messages);
      } catch (error) {
        console.log("Error fetching chat content:", error);
      }
    };

    fetchChatContent();
  }, [roomId]);

  const sendMessage = () => {
    if (!socket || !roomId || !content) return;

    socket.emit("send_msg", {
      roomId: roomId,
      senderid: userid,
      content: content,
    });

    setContent("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-col flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message._id} className="flex items-start mb-4">
            <img src={message.Avatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
            <div className="flex flex-col">
              <h3 className="text-red-500 font-bold">{message.Username}</h3>
              <h5 className="text-gray-700">{message.content}</h5>
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-300">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          type="text"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Actualchat;
