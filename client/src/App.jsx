import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login/Login";
<<<<<<< HEAD
import Profile from "./Profileuser/Profile";
import ViewPost from "./view_post/Vewpost";
import Chat from "./Chat/Chat";
import NotFound from "./Notfound";
import Register from './Regsiter/Register';
import Bookmark from "./bookmarks/Bookmark";

=======
import Register from "./register/Register";
import Profile from "./Profileuser/Profile";
import ViewPost from "./view_post/Vewpost";
import Chat from "./Chat/Chat";
import NotFound from "./Notfound"; 
import Bookmark from "./bookmarks/Bookmark";
>>>>>>> c59582f82f0a1b43219700feb014f9d8bc25a389
const App = () => {
  const isAuthenticated = localStorage.getItem("token") !== null;

  return (
    <BrowserRouter>
<<<<<<< HEAD
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
=======
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          
          <Route
  path="/register"
  element={<Register />}
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
>>>>>>> c59582f82f0a1b43219700feb014f9d8bc25a389
    </BrowserRouter>
  );
};

export default App;
