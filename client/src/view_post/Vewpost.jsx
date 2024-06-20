import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../API/Api";
import { jwtDecode } from "jwt-decode";

const ViewPost = () => {
  const { postid } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [addComment, setAddComment] = useState("");
  const [showComments, setShowComments] = useState([]);
  const [avatarData, setAvatarData] = useState({});

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userID = decoded ? decoded.userid : null;
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await Api.get(`/getpostbyid/${postid}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null); 
      }
    };

    fetchPostById();
  }, [postid]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get(`/finduser/${userID}`);
        if (response.data && response.data.userdata) {
          setAvatarData(response.data.userdata);
        } else {
          throw new Error("User data not found");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
      }
    };

    fetchUserData();
  }, [userID]);

  const handleBack = () => {
    navigate("/");
  };

  const handleAddComment = async () => {
    try {
      const response = await Api.post(`/comment/${postid}`, {
        userID: userID,
        content: addComment,
      });
      const newComment = response.data; // Assuming the server returns the newly added comment
      setShowComments([...showComments, newComment]);
      setAddComment(""); // Clear comment input after adding
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      {post ? (
        <div className="container mx-auto px-4">
          <h1
            onClick={handleBack}
            className="cursor-pointer text-blue-500 hover:text-blue-700"
          >
            Back
          </h1>
          <div className="mt-4">
            <img src={post.Image &&post.Image}className="rounded-lg shadow-lg" />
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center mb-4">
              {post.author && (
                <>
                  <img
                    src={post.author.Avatar}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full mr-2"
                  />
                  <strong>Post from: {post.author.Username}</strong>
                </>
              )}
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">{post.Caption}</h3>
            </div>
            <div className="mb-4">
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                value={addComment}
                onChange={(e) => setAddComment(e.target.value)}
                type="text"
                placeholder="Post your reply"
              />
              <button
                onClick={handleAddComment}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Reply
              </button>
            </div>
            <div>
              {post.comments.map((comment,i) => (
                <div key={i} className="mb-4">
                  {comment.author && (
                    <div className="flex items-center mb-2">
                      <img
                        src={comment.author.Avatar}
                        alt="Commenter Avatar"
                        className="h-8 w-8 rounded-full mr-2"
                      />
                      <strong>{comment.author.Username}:</strong>
                    </div>
                  )}
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
            <div>
              {showComments.map((comment) => (
                <div key={comment._id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <img
                      src={avatarData.Avatar}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full mr-2"
                    />
                    <strong>{avatarData.Username}:</strong>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ViewPost;
