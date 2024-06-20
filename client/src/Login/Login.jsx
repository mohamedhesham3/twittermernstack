import React, { useState, useEffect } from "react";
import Api from '../API/Api';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const login = async () => {
    try {
      const response = await Api.post("/login", {
        Username: username,
        Password: password,
      });
      const data = response.data;
      localStorage.setItem("token", data.token);      
      window.location.href = "/";
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-black p-8 rounded-lg shadow-lg max-w-sm w-full space-y-6">
        <div className="text-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png" alt="logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-100">Login</h1>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={login}
            className={`w-full py-2 ${loading? 'bg-blue-500' : 'bg-blue-700'} text-white rounded-md transition-colors duration-300`}
          >
            {loading? (
              <svg className="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.821 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
          <h5 onClick={() => {
            location.href='/register'
          }} className="text-white flex justify-center align-center cursor-pointer w-full">dont have an account?</h5>
      </div>
    </div>
  );
};

export default Login;
