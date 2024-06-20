import React, { useState, useEffect } from 'react';
import Api from '../API/Api';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FaFire } from "react-icons/fa";
import { SiMessenger } from "react-icons/si";
import { IoBookmarkSharp } from "react-icons/io5";
import { postfocus } from '../../Store/Store';
import { useAtom } from 'jotai';
import { jwtDecode } from "jwt-decode";

const Nav = () => {
  const [userData, setUserData] = useState({});
  const [notifications, setNotifications] = useState(0); 
  const [refetchTrigger, setRefetchTrigger] = useState(false); 
  const navigate = useNavigate();
  const [showmsg, setshowmsg] = useAtom(postfocus);


  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;
    const userid = decoded ? decoded.userid : null;

    if (!token || !userid) {
      throw new Error('User not authenticated');
    }

    try {
      const res = await Api.get(`/finduser/${userid}`);
      setUserData(res.data.userdata);
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [refetchTrigger]);

  useEffect(() => {
    const socket = io('');
    socket.on('new_notification', (data) => {
      console.log('New notification:', data);
      setNotifications(data.messageCount);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDivClick = () => {
    setNotifications(0);

    setRefetchTrigger(prev => !prev);

    navigate('/chat/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col  mt-4"> 
      <div className="flex flex-col space-y-4">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/bookmarks')}>
          <IoBookmarkSharp className="text-2xl mr-2" />
          <span className="text-lg">Bookmarks</span>
        </div>
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/trends')}>
          <FaFire className="text-2xl mr-2" />
          <span className="text-lg">Trends</span>
        </div>
        <div className="flex items-center cursor-pointer" onClick={handleDivClick}>
          <SiMessenger className="text-2xl mr-2" />
          <span className="text-lg">Messages</span>
          {notifications > 0 && (
            <span className="bg-red-500 text-white rounded-full px-2 ml-2">{notifications}</span>
          )}
        </div>
        <button onClick={() => setshowmsg(true)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white">
          Post
        </button>
        <div className="flex items-center cursor-pointer" onClick={() => navigate(`/profile/${userData._id}`)}>
          <img className="w-8 h-8 rounded-full mr-2" src={userData?.Avatar || null} alt="User Profile" />
          <span className="text-lg">{userData ? userData.Username : 'Loading...'}</span>
        </div>
      <button onClick={() => {
        localStorage.clear()
        location.href='/login'
      }} className="bg-red-500 hover:bg-red-600  text-white font-bold py-2 px-4 rounded">
  Logout
</button>
      </div>

    </nav>
  );
};

export default Nav;
