import React, { useEffect, useState, useRef } from "react";
import Api from '../API/Api';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "../header/Header";
import pop from "../assets/iphone_send_sms.mp3";
import io from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import {jwtDecode} from "jwt-decode";

const Chat = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userid = decoded ? decoded.userid : null;
  const { roomId: urlRoomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState(urlRoomId);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef(null);
  const audioRef = useRef(new Audio(pop));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const newSocket = io("https://twittermernstack.onrender.com/");
    setSocket(newSocket);

    newSocket.on("receive_msg", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setIsPlaying(true);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await Api.get(`/getroomsbyuser/${userid}`);
        setRooms(res.data);
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, [userid]);

  useEffect(() => {
    setRoomId(urlRoomId);
  }, [urlRoomId]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (roomId) {
        try {
          const res = await Api.get(`/chat/${roomId}`);
          setMessages(res.data.messages);
        } catch (error) {
          console.log("Error fetching chat messages:", error);
        }
      }
    };
    fetchChatMessages();
  }, [roomId]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause(); 
    }
  };

  const handleRoomSelect = (selectedRoomId) => {
    navigate(`/chat/${selectedRoomId}`);
  };

  const sendMessage = async () => {
    if (!socket || !roomId || !content) return;

    socket.emit("send_msg", {
      roomId: roomId,
      senderid: userid,
      content: content,
    });
    setShowEmojiPicker(false)
    setContent("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    togglePlay();
  }, [isPlaying]);

  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("ended", handleAudioEnded);

    return () => {
      audioRef.current.removeEventListener("ended", handleAudioEnded);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="flex h-[92vh]">
        {/* Rooms Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Rooms</h2>
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => handleRoomSelect(room._id)}
              className={`flex items-center p-2 cursor-pointer ${room._id === roomId ? "bg-gray-700" : ""}`}
            >
              {room.members.map((member, index) => (
                <div key={index} className="flex items-center">
                  {member._id !== userid && (
                    <>
                      <img src={member.Avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
                      <span>{member.Username}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col bg-gray-900 text-white p-4">
          {location.pathname !== `/chat/${roomId}` ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Select a Room</h1>
                <p className="text-lg">Choose from your existing conversations, start a new one, or just keep swimming.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {messages.map((message) => (
                <div key={message._id} className="flex mb-2">
                  <img src={message.Avatar} alt="" className="w-8 h-8 rounded-full mr-2" />
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <strong>{message.Username}: </strong>
                    <span>{message.content}</span>
                  </div>
                </div>
              ))}
              <div ref={chatContainerRef}></div>
            </div>
          )}
          
          {/* Message Input */}
          {roomId && (
            <div className="flex items-center mt-4">
              <input
                className="flex-1 bg-gray-800 text-white p-2 rounded-lg mr-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                type="text"
                placeholder="Type a message..."
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white"
                onClick={sendMessage}
              >
                Send
              </button>
              <MdOutlineEmojiEmotions
                className="text-2xl ml-2 cursor-pointer text-gray-400 hover:text-gray-300"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="fixed bottom-0 right-0 z-10 p-4">
          <EmojiPicker
            onEmojiClick={(emoji, event) => {
              setContent(content + emoji.emoji);
            }}
            disableSearchBar
            disableSkinTonePicker
            groupVisibility={{
              recently_used: false,
            }}
            native
          />
        </div>
      )}
      
      <audio ref={audioRef} src={pop} />
    </>
  );
};

export default Chat;
