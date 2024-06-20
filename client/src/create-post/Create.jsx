import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa";
import Api from '../API/Api';
import { useAtom } from "jotai";
import { postfocus } from "../../Store/Store";
import { jwtDecode } from "jwt-decode";

const Create = () => {
  const [Caption, setCaption] = useState("");
  const [Image, setImage] = useState(null);
  const [isloading, setisloading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [showmsg, setshowmsg] = useAtom(postfocus);
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userid = decoded ? decoded.userid : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userid) {
          const res = await Api.get(`/finduser/${userid}`);
          const userData = res.data.userdata;
          setAvatar(userData.Avatar);
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userid]);

  const createpost = async () => {
    const formdata = new FormData();
    formdata.append("Caption", Caption);
    formdata.append("Image", Image);

    try {
      const res = await Api.post(`/post/${userid}`, formdata);
      if (res.status >= 200 && res.status < 300) {
        setisloading(true);
        console.log("Post created successfully!");
      } else {
        console.log("Unexpected response:", res.status, res.statusText);
      }
    } catch (error) {
      console.log("Error creating post:", error);
    } finally {
      window.location.reload();
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      {showmsg ? (
        <div className="bg-yellow-200 py-2 px-4 rounded mb-4">
          <h5 className="text-sm">Let's start a trend! Use hashtags to spread the word.</h5>
        </div>
      ) : null}

      {isloading ? (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
        <div className="flex items-start mb-4">
          <img className="w-12 h-12 rounded-full mr-2" src={avatar} alt="Avatar" />
          <textarea
            name="post"
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 bg-gray-100 rounded-lg p-2 focus:outline-none"
            placeholder="What's happening?"
            rows={3}
          ></textarea>
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="fileInput" className="text-gray-600 mr-2 cursor-pointer">
            <FaImage className="text-blue-500 text-xl" />
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleImageUpload}
            className="hidden"
          />
          {Image && (
            <img src={URL.createObjectURL(Image)} className="w-16 h-16 rounded-lg object-cover" alt="Uploaded" />
          )}
        </div>
        <button onClick={createpost} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
          Post
        </button>
      </div>
    </>
  );
};

export default Create;
