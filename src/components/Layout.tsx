
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MiniPlayer from "./MiniPlayer";
import Navbar from "./Navbar";
import { useTheme } from "@/hooks/useTheme";

const Layout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  // This ensures the theme is applied to the root element
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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
