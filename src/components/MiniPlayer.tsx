
import React, { useState, useEffect } from "react";
import { Play, Pause, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import FullPlayer from "./FullPlayer";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useFavorites } from "@/hooks/useFavorites";

const MiniPlayer = () => {
  const { currentSong, isPlaying, togglePlay, progress } = useMusicPlayer();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  if (!currentSong) return null;

  const favoriteStatus = isFavorite(currentSong.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteStatus) {
      removeFavorite(currentSong.id);
    } else {
      addFavorite({
        id: currentSong.id,
        title: currentSong.title,
        artist: currentSong.artist,
        albumArt: currentSong.albumArt
      });
    }
  };

  return (
    <>
      <div
        onClick={() => setShowFullPlayer(true)}
        className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t p-2 cursor-pointer animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden">
            <img
              src={currentSong.albumArt || "/placeholder.svg"}
              alt="Album Art"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{currentSong.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={cn(
                "p-2 rounded-full transition-colors",
                favoriteStatus ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart className={cn("h-5 w-5", favoriteStatus && "fill-current")} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 rounded-full bg-primary text-primary-foreground"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="h-1 mt-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <Dialog open={showFullPlayer} onOpenChange={setShowFullPlayer}>
        <DialogContent className="max-w-md p-0 border-none bg-transparent">
          <DialogTitle className="sr-only">
            <VisuallyHidden>Now Playing</VisuallyHidden>
          </DialogTitle>
          <FullPlayer />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MiniPlayer;
