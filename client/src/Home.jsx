import React from "react";
import Header from "./header/Header";
import Nav from "./Navbar/Nav";
import Create from "./create-post/Create";
import "./index.css";
import Public from "./Public_posts/Public";

const Home = () => {
  return (
    <div className="flex flex-col"> 
      <Header /> 
      
      <div className="flex"> 
        <div className="w-full">
          <Create />
          <Public />
        </div>

        <Nav />
      </div>
    </div>
  );
};

export default Home;
