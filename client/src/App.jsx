import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Register from "./register/Register";
import Profile from "./Profileuser/Profile";
import ViewPost from "./view_post/Vewpost";
import Chat from "./Chat/Chat";
import NotFound from "./Notfound.jsx"; 
import Bookmark from "./bookmarks/Bookmark";
const App = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
                      <Route
  path="/register"
  element={isAuthenticated ? <Navigate to="/" /> : <Register />}
/>


          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          


          
          {isAuthenticated && (
            <Route path="/profile/:userid" element={<Profile />} />
          )}
          
          {isAuthenticated && (
            <Route path="/viewpost/:postid" element={<ViewPost />} />
          )}
          
          {isAuthenticated && (
            <>
              <Route path="/chat/:roomId" element={<Chat />} />
              <Route path="/chat" element={<Chat />} />
            </>
          )}
          
          {isAuthenticated && (
            <Route path="/bookmarks" element={<Bookmark />} />
          )}
            
          
          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
