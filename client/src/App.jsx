import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
import Profile from "./Profileuser/Profile";
import ViewPost from "./view_post/Vewpost";
import Chat from "./Chat/Chat";
import NotFound from "./Notfound";
import Register from './Regsiter/Register';
import Bookmark from "./bookmarks/Bookmark";

const App = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/register" />}
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
          <>
            <Route path="/profile/:userid" element={<Profile />} />
            <Route path="/viewpost/:postid" element={<ViewPost />} />
            <Route path="/chat/:roomId" element={<Chat />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/bookmarks" element={<Bookmark />} />
          </>
        )}
        
        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
