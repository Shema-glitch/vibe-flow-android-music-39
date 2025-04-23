
import React from "react";
import { Outlet } from "react-router-dom";
import MiniPlayer from "./MiniPlayer";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Layout;
