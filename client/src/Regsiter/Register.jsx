import React, { useState } from 'react';
import Api from '../API/Api';

const Register = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Avatar: null,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      Avatar: e.target.files[0],
    });
  };

  const register = async () => {
    const data = new FormData();
    data.append('Username', formData.Username);
    data.append('Email', formData.Email);
    data.append('Password', formData.Password);
    if (formData.Avatar) {
      data.append('Avatar', formData.Avatar);
    }

    try {
      const res = await Api.post('/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res.data);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            id="username"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            id="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            id="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="avatar">Avatar</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="file"
            id="avatar"
            name="Avatar"
            onChange={handleFileChange}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
