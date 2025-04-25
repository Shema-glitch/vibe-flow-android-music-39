
import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useFavorites } from "@/hooks/useFavorites";

const FullPlayer = () => {
  const { isPlaying, togglePlay, currentSong, nextSong, prevSong, lyrics, loadingLyrics } = useMusicPlayer();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [showLyrics, setShowLyrics] = useState(false);

  const favoriteStatus = currentSong ? isFavorite(currentSong.id) : false;

  const toggleFavorite = () => {
    if (!currentSong) return;
    
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
    <div className="bg-card rounded-t-xl p-6 shadow-lg max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex flex-col items-center mb-6">
        <div className="mb-8 w-full max-w-[280px] aspect-square bg-primary/10 rounded-xl overflow-hidden shadow-lg">
          <img
            src={currentSong?.albumArt || "/placeholder.svg"}
            alt="Album Cover"
            className={cn(
              "w-full h-full object-cover transition-transform duration-5000",
              isPlaying && "animate-spin-slow"
            )}
            style={{ animationDuration: "10s" }}
          />
        </div>

        <div className="w-full text-center mb-6">
          <h2 className="text-xl font-bold mb-1 animate-in fade-in-25">{currentSong?.title || "No Track Selected"}</h2>
          <p className="text-muted-foreground animate-in fade-in-50">{currentSong?.artist || "Unknown Artist"}</p>
        </div>

        <div className="w-full mb-6">
          <div className="flex justify-between text-xs mb-1">
            <span>1:45</span>
            <span>3:30</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary w-1/2 rounded-full" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Shuffle className="h-5 w-5" />
          </button>
          <button 
            className="text-foreground hover:text-primary transition-colors"
            onClick={prevSong}
          >
            <SkipBack className="h-6 w-6" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-primary text-primary-foreground h-14 w-14 flex items-center justify-center rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </button>
          <button 
            className="text-foreground hover:text-primary transition-colors"
            onClick={nextSong}
          >
            <SkipForward className="h-6 w-6" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Repeat className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between w-full">
          <button className="flex items-center gap-2 text-muted-foreground">
            <Volume2 className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFavorite}
            className={cn(
              "transition-colors",
              favoriteStatus ? "text-red-500" : "text-muted-foreground"
            )}
          >
            <Heart className={cn("h-6 w-6", favoriteStatus && "fill-current")} />
          </button>
        </div>
      </div>

      <Drawer open={showLyrics} onOpenChange={setShowLyrics}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">Show Lyrics</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-6 pt-0 max-h-[70vh] overflow-y-auto">
            <div className="mt-6">
              {loadingLyrics ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-9/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-10/12" />
                </div>
              ) : lyrics ? (
                <div className="whitespace-pre-line text-center">
                  {lyrics}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">No lyrics available for this track.</p>
                  <p className="text-sm text-muted-foreground">Lyrics are automatically searched when available.</p>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FullPlayer;
