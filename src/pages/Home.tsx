
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
}

const mockSongs: Song[] = [
  { id: "1", title: "Smooth Vibes", artist: "LoFi Dreamer", albumArt: "/placeholder.svg", duration: "3:24" },
  { id: "2", title: "Late Night Drive", artist: "Chill Wave", albumArt: "/placeholder.svg", duration: "2:55" },
  { id: "3", title: "Urban Rhythm", artist: "Beat Master", albumArt: "/placeholder.svg", duration: "4:12" },
  { id: "4", title: "Sunset Memories", artist: "Ambient Dreams", albumArt: "/placeholder.svg", duration: "3:50" },
  { id: "5", title: "Downtown Funk", artist: "Groove Collective", albumArt: "/placeholder.svg", duration: "3:18" },
  { id: "6", title: "Mountain Echo", artist: "Nature Sounds", albumArt: "/placeholder.svg", duration: "5:22" },
];

const Home = () => {
  const [recentlyAdded, setRecentlyAdded] = useState<Song[]>([]);
  const [mostPlayed, setMostPlayed] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      try {
        // In a real app, this would be an actual API call or local file scan
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecentlyAdded(mockSongs.slice(0, 4));
        setMostPlayed(mockSongs.slice(2));
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error loading music",
          description: "Failed to load your music library",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recently Added</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {loading
              ? Array(4).fill(0).map((_, i) => (
                <CarouselItem key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Card>
                    <CardContent className="p-4">
                      <Skeleton className="w-full aspect-square rounded-md mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))
              : recentlyAdded.map((song) => (
                <CarouselItem key={song.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <AlbumCard song={song} />
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Most Played</h2>
        <div className="grid grid-cols-1 gap-4">
          {loading
            ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))
            : mostPlayed.map((song) => (
              <SongListItem key={song.id} song={song} />
            ))}
        </div>
      </section>
    </div>
  );
};

interface SongCardProps {
  song: Song;
}

const AlbumCard = ({ song }: SongCardProps) => (
  <Card className="overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer">
    <CardContent className="p-0">
      <div className="aspect-square bg-muted">
        <img src={song.albumArt} alt={song.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{song.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
    </CardContent>
  </Card>
);

const SongListItem = ({ song }: SongCardProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors duration-300 cursor-pointer">
    <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden">
      <img src={song.albumArt} alt={song.title} className="h-full w-full object-cover" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-sm truncate">{song.title}</h3>
      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
    </div>
    <div className="text-xs text-muted-foreground">{song.duration}</div>
  </div>
);

export default Home;
