import React, { useEffect, useState } from "react";
import Api from '../API/Api';
import { FcLike } from "react-icons/fc";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import "../index.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

const Public = () => {
  const { userid } = useParams();
  const [postarr, setPostarr] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userID = decoded ? decoded.userid : null;
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await Api.get("/grtall");
        setPostarr(res.data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const notify = (message) => {
    toast(message);
  };

  const handleLike = async (postId) => {
    try {
      const res = await Api.post(`/like/${postId}`, { userID });
      notify("Post Liked!");
      // Optional: Update postarr state to reflect the updated like status
    } catch (error) {
      console.log("Error liking post:", error);
    }
  };

  const handleBookmarkClick = async (postId) => {
    try {
      const res = await Api.post("/bookmark", { postid: postId, userid: userID });
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
        {postarr.map((post, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg mb-4">
            <div className="p-4">
              <div className="flex items-center">
                <img className="w-12 h-12 rounded-full mr-4" src={post.author.Avatar} alt="User Avatar" />
                <div>
                  <h4 className="text-lg font-semibold">{post.author.Username}</h4>
                  <p className="text-gray-500 text-sm">{moment(post.createdAt).format("MMM DD, hh:mm A")}</p>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-semibold">{post.Caption}</h3>
                {post.Image && (
                  <img
                    className="mt-2 cursor-pointer rounded-lg w-[20%] h-[20%]"
                    onClick={() => handlePostClick(post._id)}
                    src={post.Image}
                    alt="Post Image"
                  />
                )}
              </div>
              <div className="flex items-center mt-4">
                <FcLike
                  className="text-blue-500 mr-2 cursor-pointer"
                  onClick={() => handleLike(post._id)}
                />
                <AiOutlineComment
                  className="text-blue-500 mr-2 cursor-pointer"
                  onClick={() => handlePostClick(post._id)}
                />
                <RiBookmarkLine
                  className="text-blue-500 cursor-pointer"
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
