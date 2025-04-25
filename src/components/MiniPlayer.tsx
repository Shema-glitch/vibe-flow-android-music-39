import React, { useState } from "react";
import { Play, Pause, Heart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import FullPlayer from "./FullPlayer";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";

const MiniPlayer = () => {
  const { currentSong, isPlaying, togglePlay } = useMusicPlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  if (!currentSong) return null;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <div
        onClick={() => setShowFullPlayer(true)}
        className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t p-2 cursor-pointer animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden animate-pulse">
            <img
              src="/placeholder.svg"
              alt="Album Art"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">Sample Track</h3>
            <p className="text-xs text-muted-foreground truncate">Unknown Artist</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={cn(
                "p-2 rounded-full transition-colors",
                isFavorite ? "text-red-500" : "text-muted-foreground"
              )}
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-primary text-primary-foreground"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="h-1 mt-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 rounded-full" />
        </div>
      </div>

      <Dialog open={showFullPlayer} onOpenChange={setShowFullPlayer}>
        <DialogContent className="max-w-md p-0 border-none bg-transparent">
          <FullPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MiniPlayer;
