
import React from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { Heart, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const { playSong, formatDuration } = useMusicPlayer();

  const handlePlay = (song: any) => {
    // We need to include a src for the song to play
    // This would typically come from the file URI, but for favorites we may only have metadata
    playSong({
      ...song,
      src: song.src || '' // If we don't have a src, playback will show an error
    });
  };

  return (
    <div className="p-4 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
          <p className="text-muted-foreground">Songs you mark as favorite will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {favorites.map((song) => (
            <div 
              key={song.id} 
              className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors cursor-pointer"
              onClick={() => handlePlay(song)}
            >
              <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden flex items-center justify-center">
                {song.albumArt ? (
                  <img src={song.albumArt} alt={song.title} className="h-full w-full object-cover" />
                ) : (
                  <FileAudio className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{song.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <button 
                className={cn("p-2 rounded-full text-red-500")}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(song.id);
                }}
              >
                <Heart className="h-5 w-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
