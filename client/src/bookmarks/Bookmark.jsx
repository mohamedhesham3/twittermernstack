import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Nav from "../Navbar/Nav";
import Api from '../API/Api';
import { jwtDecode } from "jwt-decode";

const Bookmark = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded ? decoded.userid : null;

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (userId) {
          const res = await Api.get(`/finduser/${userId}`);
          const userData = res.data.userdata;
          const userBookmarks = userData.bookmarks || [];
          setBookmarks(userBookmarks);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <p>Failed to fetch bookmarks. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{bookmarks.length} Results Found</h1>
        
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark._id} className="bg-white rounded-lg border border-gray-300 shadow-md p-4">
              <div className="flex items-start space-x-4">
                <img src={bookmark.author.Avatar} className="h-12 w-12 rounded-full" alt="" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <h5 className="text-sm font-bold text-gray-900">{bookmark.author.Username}</h5>
                  </div>
                  <p className="text-sm text-gray-700">{bookmark.Caption}</p>
                  <img src={bookmark.Image} className="mt-2 rounded-lg w-full" alt="" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Bookmark;
