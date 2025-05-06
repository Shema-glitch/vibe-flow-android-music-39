
import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useFavorites } from "@/hooks/useFavorites";

const FullPlayer = () => {
  const { 
    isPlaying, 
    togglePlay, 
    currentSong, 
    nextSong, 
    prevSong, 
    lyrics, 
    loadingLyrics,
    progress,
    seekTo,
    getCurrentPosition,
    getTotalDuration,
    volume,
    changeVolume,
    isShuffled,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode
  } = useMusicPlayer();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentPosition, setCurrentPosition] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");

  const favoriteStatus = currentSong ? isFavorite(currentSong.id) : false;

  // Update time displays
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentPosition(getCurrentPosition());
        setTotalDuration(getTotalDuration());
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, getCurrentPosition, getTotalDuration]);

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

  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    changeVolume(value[0] / 100);
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
            <span>{currentPosition}</span>
            <span>{totalDuration}</span>
          </div>
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <button 
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              isShuffled && "text-primary"
            )}
            onClick={toggleShuffle}
          >
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
          <button 
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              repeatMode !== 'none' && "text-primary"
            )}
            onClick={cycleRepeatMode}
          >
            <Repeat className="h-5 w-5" />
            {repeatMode === 'one' && <span className="absolute text-[8px] font-bold">1</span>}
          </button>
        </div>

        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2 w-1/3">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
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
