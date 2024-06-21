import React, { useState, useEffect } from "react";
import Api from "../API/Api";
import { FaImage } from "react-icons/fa";

import { useAtom } from "jotai";
import {
  avatar,
  email,
  password,
  username,
  fileupload,
} from "../../Store/Store";

const Register = () => {
  const [Username, setUsername] = useAtom(username);
  const [Email, setEmail] = useAtom(email);
  const [Password, setPassword] = useAtom(password);
  const [Avatar, setAvatar] = useAtom(avatar);
  const [fileInput, setFileInput] = useAtom(fileupload);
  const [loadX, setLoadX] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
    setAvatar(file);
  };

  const Register = async () => {
    const formData = new FormData();
    formData.append("Username", Username);
    formData.append("Email", Email);
    formData.append("Password", Password);

    if (Avatar) {
      formData.append("Avatar", Avatar);
    }

    try {
      const response = await Api.post("/register", formData);
      const data = response.data;

      localStorage.setItem("token", data.token);

      console.log("Registration successful. Token:", data.token);
      window.location.href = "/";
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        console.log("Server responded with:", error.response.data);
        setError(error.response.data.message)
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadX(true);
    }, 1500);
  }, []);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-black p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png"
            alt="logo"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-4">Register</h1>
        </div>
        <form>
        <h4 className="text-red-500 justify-center flex">{error&&error}</h4>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-white mr-2"
            >
              Avatar
            </label>
            <label htmlFor="imgselect" className="icon cursor-pointer">
              <FaImage className="text-gray-400 hover:text-gray-600" />
            </label>
            <input
              id="imgselect"
              name="Avatar"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileInput && (
              <img
                className="w-12 h-12 object-cover rounded-full ml-2"
                src={URL.createObjectURL(fileInput)}
                alt="Avatar Preview"
              />
            )}
          </div>
          <button
            type="button"
            onClick={Register}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-300 ease-in-out"
          >
            Register
          </button>
        </form>
        <h5
          onClick={() => {
            location.href = "/login";
          }}
          className="text-white flex justify-center align-center w-full cursor-pointer"
        >
          already have an account?
        </h5>
      </div>
    </div>
  );
};

export default Register;