
import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FullPlayerProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullPlayer = ({ isPlaying, setIsPlaying }: FullPlayerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);

  // Simulate fetching lyrics when the player opens
  useEffect(() => {
    const fetchLyrics = async () => {
      if (showLyrics && !lyrics && !loadingLyrics) {
        setLoadingLyrics(true);
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // 70% chance to find lyrics, 30% chance not to find any
          const foundLyrics = Math.random() > 0.3;
          
          if (foundLyrics) {
            setLyrics(`[Verse 1]
I've been searching for something real
In a world of illusions that never heal
The city lights blind my tired eyes
As I wander through these crowded skies

[Chorus]
But with you, I found my way
Through the darkness to a brighter day
No matter how far we might roam
In your arms, I've found my home

[Verse 2]
The morning sun breaks through the clouds
Silencing all my doubts out loud
Every moment feels like a dream
With you beside me in this stream

[Bridge]
Time stands still when we're together
A love like this lasts forever
Through the storms and sunny days
I'll be with you, always

[Chorus]
But with you, I found my way
Through the darkness to a brighter day
No matter how far we might roam
In your arms, I've found my home`);
          } else {
            setLyrics(null);
          }
        } catch (error) {
          console.error("Error fetching lyrics:", error);
        } finally {
          setLoadingLyrics(false);
        }
      }
    };
    
    fetchLyrics();
  }, [showLyrics, lyrics, loadingLyrics]);

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
