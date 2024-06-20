import React, { useEffect, useState } from "react";
import Api from '../API/Api';
import { FcLike } from "react-icons/fc";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineComment, AiOutlineBook } from "react-icons/ai"; // Correct icons
import moment from "moment";
import "../index.css";
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiBookmarkLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";

const Public = () => {
  const { userid } = useParams();
  const [postarr, setPostarr] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userID = decoded ? decoded.userid : null;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newsocket = io("https://twittermernstack.onrender.com/");

    newsocket.on('connect', () => {
      console.log("new user connected");
    });

    newsocket.on('disconnect', () => {
      console.log("user disconnected");
    });

    newsocket.on('likeUpdated', (data) => {
      setLikes(prevLikes => ({
        ...prevLikes,
        [data._id]: data.likes ? data.likes.length : 0
      }));
    });

    setSocket(newsocket);
  
    return () => {
      newsocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await Api.get("/grtall");
        setPostarr(res.data);
        const initialLikes = {};
        const initialComments = {};
        res.data.forEach(post => {
          initialLikes[post._id] = post.likes ? post.likes.length : 0;
          initialComments[post._id] = post.comments ? post.comments.length : 0; 
        });
        setLikes(initialLikes);
        setComments(initialComments);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const notify = (message) => {
    toast(message);
  };

  const handleLike = (postId) => {
    if (!socket) return;
    socket.emit('addLike', { PostID: postId, userid: userID });
    notify("Post Liked!");
  };

  const handleBookmarkClick = async (postId) => {
    try {
      await Api.post("/bookmark", { postid: postId, userid: userID });
      notify("Post Bookmarked!");
    } catch (error) {
      console.log("Error bookmarking post:", error);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/viewpost/${postId}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-4">
        {postarr.map((post) => (
          <div key={post._id} className="max-w-md bg-white shadow-md rounded-lg mb-4 mx-auto">
            <div className="p-4">
              <div className="flex items-center">
                <img className="w-10 h-10 rounded-full mr-4" src={post.author.Avatar} alt="User Avatar" />
                <div>
                  <h4 className="text-sm font-semibold">{post.author.Username}</h4>
                  <p className="text-xs text-gray-500">{moment(post.createdAt).format("MMM DD, hh:mm A")}</p>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-sm font-semibold">{post.Caption}</h3>
                {post.Image && (
                  <img
                    className="mt-2 cursor-pointer rounded-lg mx-auto max-w-full h-auto"
                    style={{ maxWidth: '100%', maxHeight: '12rem' }}
                    onClick={() => handlePostClick(post._id)}
                    src={post.Image}
                    alt="Post Image"
                  />
                )}
              </div>
              <div className="flex items-center mt-2">
                <h5>{likes[post._id]}</h5>
                <FcLike
                  className="text-blue-500 mr-2 cursor-pointer text-sm"
                  onClick={() => handleLike(post._id)}
                />
                <AiOutlineComment
                  className="text-blue-500 mr-2 cursor-pointer text-sm"
                  onClick={() => handlePostClick(post._id)}
                />
                <h5>{comments[post._id]}</h5>
                <RiBookmarkLine
                  className="text-blue-500 cursor-pointer text-sm"
                  onClick={() => handleBookmarkClick(post._id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Public;
