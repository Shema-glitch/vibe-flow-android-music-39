
import React, { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface FullPlayerProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullPlayer = ({ isPlaying, setIsPlaying }: FullPlayerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-card rounded-t-xl p-6 shadow-lg max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-500">
      <div className="flex flex-col items-center mb-6">
        <div className="mb-8 w-full max-w-[280px] aspect-square bg-primary/10 rounded-xl overflow-hidden shadow-lg">
          <img
            src="/placeholder.svg"
            alt="Album Cover"
            className={cn(
              "w-full h-full object-cover transition-transform duration-5000",
              isPlaying && "animate-spin-slow"
            )}
            style={{ animationDuration: "10s" }}
          />
        </div>

        <div className="w-full text-center mb-6">
          <h2 className="text-xl font-bold mb-1 animate-in fade-in-25">Sample Track</h2>
          <p className="text-muted-foreground animate-in fade-in-50">Unknown Artist</p>
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
          <button className="text-foreground hover:text-primary transition-colors">
            <SkipBack className="h-6 w-6" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-primary text-primary-foreground h-14 w-14 flex items-center justify-center rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </button>
          <button className="text-foreground hover:text-primary transition-colors">
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
            onClick={() => setIsFavorite(!isFavorite)}
            className={cn(
              "transition-colors",
              isFavorite ? "text-red-500" : "text-muted-foreground"
            )}
          >
            <Heart className={cn("h-6 w-6", isFavorite && "fill-current")} />
          </button>
        </div>
      </div>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full">Show Lyrics</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-6 pt-0">
            <div className="mt-6 text-center space-y-4">
              <p className="text-muted-foreground">Lyrics not available for this track.</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FullPlayer;
