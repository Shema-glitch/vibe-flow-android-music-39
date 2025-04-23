
import React from "react";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
}

const favoriteSongs: Song[] = [
  { id: "2", title: "Late Night Drive", artist: "Chill Wave", albumArt: "/placeholder.svg", duration: "2:55" },
  { id: "4", title: "Sunset Memories", artist: "Ambient Dreams", albumArt: "/placeholder.svg", duration: "3:50" },
];

const Favorites = () => {
  return (
    <div className="p-4 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      
      {favoriteSongs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No favorite songs yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {favoriteSongs.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors cursor-pointer"
            >
              <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden">
                <img src={song.albumArt} alt={song.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{song.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <div className="text-xs text-muted-foreground">{song.duration}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
