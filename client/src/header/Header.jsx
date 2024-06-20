import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Api from '../API/Api';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [chatlocation, setchatlocation] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        if (window.location.pathname === '/chat/') {
            setchatlocation(true);
        }
    }, []);

    useEffect(() => {
        const getUserByName = async () => {
            try {
                if (searchQuery.trim() !== '') {
                    const res = await Api.get(`/getUserbyname?Username=${searchQuery}`);
                    setSearchResults(res.data);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const delayTimer = setTimeout(() => {
            getUserByName();
        }, 100);

        return () => {
            clearTimeout(delayTimer);
        };
    }, [searchQuery]);

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const navigatetoprofle = (userid) => {
        nav(`/profile/${userid}`);
    };

    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            <div className="flex space-x-4">
                <h4 className="cursor-pointer">For You</h4>
                <h4 className="cursor-pointer">Following</h4>
            </div>

            <div className="flex items-center space-x-2">
                <FaSearch className="text-xl cursor-pointer" />
                <input
                    onChange={handleSearchInputChange}
                    value={searchQuery}
                    placeholder="Search"
                    className="search p-2 rounded bg-gray-700 text-white focus:outline-none"
                    type="text"
                    maxLength={50}
                />
            </div>

            <img
                className="cursor-pointer w-10"
                src="https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png"
                alt="Logo"
                onClick={() => {
                    window.location.href = '/'
                }}
            />

            {searchResults.length > 0 && (
                <div className="absolute top-16 right-0 w-64 bg-gray-700 text-white rounded shadow-lg p-4">
                    <h4>Search Results:</h4>
                    <ul>
                        {searchResults.map((user) => (
                            <div onClick={() => navigatetoprofle(user._id)} key={user._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-600 p-2 rounded">
                                <h5>{user.Username}</h5>
                                <img src={user.Avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
};

export default Header;
