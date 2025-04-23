
import React from "react";
import { NavLink } from "react-router-dom";
import { Heart, ListMusic, Settings } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: <ListMusic className="h-5 w-5" />, label: "Library", path: "/" },
    { icon: <Heart className="h-5 w-5" />, label: "Favorites", path: "/favorites" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="h-full bg-sidebar p-4">
      <div className="mb-8 p-2">
        <h2 className="text-2xl font-bold text-primary">VibeFlow</h2>
        <p className="text-sm text-muted-foreground">Your Music, Your Vibe</p>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium scale-105"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
