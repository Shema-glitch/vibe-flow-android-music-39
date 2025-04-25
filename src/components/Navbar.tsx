import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { Input } from "@/components/ui/input";
import { useFileSystem } from "@/hooks/useFileSystem";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { musicFiles } = useFileSystem();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  };

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
        <button 
          className="p-2 rounded-full bg-primary/10 text-primary"
          onClick={toggleSearch}
        >
          {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in z-50">
          <div className="container max-w-2xl mx-auto pt-20 px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for songs, artists or albums..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {searchQuery.length > 0 && (
              <div className="mt-2 bg-background/95 backdrop-blur-md border rounded-md shadow-lg max-h-[70vh] overflow-y-auto animate-in fade-in-50 slide-in-from-top-5">
                {musicFiles.filter(file => 
                  file.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  file.artist?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  file.album?.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 ? (
                  <div className="p-2 divide-y">
                    {musicFiles
                      .filter(file => 
                        file.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        file.artist?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        file.album?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map(file => (
                        <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-md cursor-pointer">
                          <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                            <Search className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.title}</p>
                            <p className="text-xs text-muted-foreground">{file.artist} • {file.album}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
