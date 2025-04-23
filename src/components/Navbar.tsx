
import React from "react";
import { Search, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full bg-primary/10 text-primary">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold text-xl">VibeFlow</h1>
        </div>
        <button className="p-2 rounded-full bg-primary/10 text-primary">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
