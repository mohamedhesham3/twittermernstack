import React, { useEffect, useState } from "react";
import { SiMessenger } from "react-icons/si";
import { BsImage } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import Api from '../API/Api';
import Header from "../header/Header";
import { FcLike } from "react-icons/fc";
import { AiOutlineComment } from "react-icons/ai";
import { RiBookmarkLine } from "react-icons/ri";
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [imgPreview, setImgPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const myId = decoded ? decoded.userid : null;
  const { userid } = useParams();
  const nav = useNavigate();
  const [socket, setSocket] = useState(null);
const navigate=useNavigate()
  useEffect(() => {
    const newSocket = io("https://twittermernstack.onrender.com");

    newSocket.on('connect', () => {
      console.log("new user connected");
    });

    newSocket.on('disconnect', () => {
      console.log("user disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('likeUpdated', updatedPost => {
      setLikes(prevLikes => ({
        ...prevLikes,
        [updatedPost._id]: updatedPost.likes.length
      }));
    });

    return () => {
      socket.off('likeUpdated');
    };
  }, [socket]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error("User not authenticated");
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await Api.get(`/finduser/${userid}`, config);

        if (!res.data) {
          throw new Error("No data received");
        }

        const userData = res.data.userdata;
        setUserData(userData);
        setFollowers(userData.followers.length);
        setFollowing(userData.following.length);

        if (userData.Posts && userData.Posts.length > 0) {
          const initialLikes = {};
          userData.Posts.forEach(post => {
            initialLikes[post._id] = post.likes ? post.likes.length : 0;
          });
          setLikes(initialLikes);
          setPosts(userData.Posts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [userid, token]);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const response = await Api.get(`/isfollowing/${userid}`, {
          params: {
            userID: myId
          }
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.log('Error fetching follow status:', error);
      }
    };

    checkFollowing();
  }, [userid, myId]);

  const msgUser = async () => {
    try {
      const usersdata = { user1: userid, user2: myId };
      const res = await Api.post("/createchat", usersdata);
      const data = res.data;
      nav(`/chat/${data._id}`);
    } catch (error) {
      console.log("Error creating chat room:", error);
    }
  };

  const follow = async () => {
    try {
      const res = await Api.post(`/follow/${userid}`, { userID: myId });
      setIsFollowing(!isFollowing);
      setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImgPreview(file);
  };

  const changeAvatar = async () => {
    const formData = new FormData();
    if (imgPreview) {
      formData.append("Avatar", imgPreview);
    }

    try {
      const avatarResponse = await Api.put(`/avatar/${userid}`, formData);
      if (avatarResponse.status === 200) {
        window.location.reload();
      } else {
        console.error("Avatar update failed");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const showEdit = () => {
    setShowEditProfile(true);
  };



  const handleBookmarkClick = async (postId) => {
    try {
      const res = await Api.post(`/bookmark/${postId}`, { userID: myId });
      if (res.status === 200) {
        // Assuming posts state is updated elsewhere, update the bookmarked post locally
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
          )
        );
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const notify = (message) => {
    toast(message);
  };

  const handleLike = (postId) => {
    if (!socket) return;
    socket.emit('addLike', { PostID: postId, userid: myId });
    notify("Post Liked!");
  };

  const handlePostClick = (postId) => {
    navigate(`/viewpost/${postId}`);
  };
  return (
    <>
      <ToastContainer/>
      <Header />

      <div className="container mx-auto mt-8">
        <div className="relative">
          {/* Cover Photo */}
          <div className="bg-gray-600 h-40 w-full relative">
            {/* Banner Image */}
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${userData.CoverPhoto})` }}
            ></div>
          </div>

          <div className="flex items-center justify-between -mt-16 mx-4 relative">
            <div className="relative">
              <img
                className="h-24 w-24 rounded-full border-4 border-white"
                src={userData.Avatar}
                alt="Profile"
              />
              {myId === userid && (
                <label
                  htmlFor="fileInput"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer"
                >
                  <BsImage className="text-gray-600" />
                </label>
              )}
              {myId === userid && (
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              )}
            </div>

            {myId === userid && (
              <button
                onClick={showEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {myId !== userid && (
          <div className="flex items-center">
            <SiMessenger
              onClick={msgUser}
              className="text-3xl text-gray-600 mr-4 cursor-pointer"
            />
            <button
              onClick={follow}
              className={`px-4 py-2 rounded-md ${isFollowing ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'} hover:bg-blue-600 focus:outline-none`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        )}

        {/* User Bio */}
        <div className="mt-4 mx-4">
          <h2 className="text-xl font-semibold">{userData.Username}</h2>
          <p className="text-gray-600">{userData.Bio}</p>
        </div>

        {/* User Statistics */}
        <div className="flex justify-around mt-4 mx-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold">{followers}</h4>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold">{following}</h4>
            <p className="text-gray-600">Following</p>
          </div>
        </div>

        {/* Posts */}
        <div className="container mx-auto p-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white shadow-md rounded-lg mb-4">
              <div className="p-4">
                <div className="flex items-center">
                  <img className="w-12 h-12 rounded-full mr-4" src={userData.Avatar} alt="User Avatar" />
                  <div>
                    <h4 className="text-lg font-semibold">{userData.Username}</h4>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-lg font-semibold">{post.Caption}</h3>
                  {post.Image && (
                    <img
                      className="mt-2 cursor-pointer rounded-lg w-full"
                      onClick={() => handlePostClick(post._id)}
                      src={post.Image}
                      alt="Post Image"
                    />
                  )}
                </div>
                <div className="flex items-center mt-4">
                  <h5>{likes[post._id]}</h5>
                  <FcLike
                    className={`text-xl mr-4 cursor-pointer ${post.isLiked ? 'text-blue-500' : 'text-gray-400'}`}
                    onClick={() => handleLike(post._id)}
                  />
                  <h5>{post.comments.length}</h5>
                  <AiOutlineComment
                    className="text-xl mr-4 cursor-pointer text-gray-400"
                    onClick={() => handlePostClick(post._id)}
                  />
                  {/* Bookmark button */}
                  <RiBookmarkLine
                    className={`text-xl cursor-pointer ${post.isBookmarked ? 'text-blue-500' : 'text-gray-400'}`}
                    onClick={() => handleBookmarkClick(post._id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Profile Overlay */}
        {showEditProfile && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-96">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-4">Change Avatar</h2>
              {imgPreview ? (
                <img
                  src={URL.createObjectURL(imgPreview)}
                  className="w-48 h-48 object-cover rounded-lg mb-4 cursor-pointer"
                  alt="Preview"
                  onClick={() => document.getElementById('fileInput').click()}
                />
              ) : (
                <img
                  src={userData.Avatar}
                  className="w-48 h-48 object-cover rounded-lg mb-4 cursor-pointer"
                  alt="Current Avatar"
                  onClick={() => document.getElementById('fileInput').click()}
                />
              )}
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={changeAvatar}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
