
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Headphones, Music, FileMusic, FileAudio, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileSystem, MusicFile } from "@/hooks/useFileSystem";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const welcomeCards = [
  {
    title: "Discover Your Music",
    description: "Scan your device to find all your favorite tracks",
    icon: <FileAudio className="h-8 w-8" />
  },
  {
    title: "Enjoy Your Collection",
    description: "Browse and play music files from your device",
    icon: <Music className="h-8 w-8" />
  },
  {
    title: "Immersive Experience",
    description: "Get lyrics and enjoy your music to the fullest",
    icon: <Headphones className="h-8 w-8" />
  }
];

const Home = () => {
  const { musicFiles, scanMusicFiles, deepScanMusicFiles, isScanning, isDeepScan } = useFileSystem();
  const { playSong, setCurrentPlaylist } = useMusicPlayer();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasMusicFiles = musicFiles.length > 0;

  // Group files by artist for display
  const [artistGroups, setArtistGroups] = useState<{ [key: string]: MusicFile[] }>({});

  useEffect(() => {
    // Process music files whenever they change
    if (musicFiles.length > 0) {
      // Group by artist
      const byArtist: { [key: string]: MusicFile[] } = {};
      musicFiles.forEach(file => {
        const artist = file.artist || "Unknown Artist";
        if (!byArtist[artist]) {
          byArtist[artist] = [];
        }
        byArtist[artist].push(file);
      });
      
      setArtistGroups(byArtist);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [musicFiles]);

  const handlePlaySong = (file: MusicFile, artistFiles: MusicFile[] = []) => {
    // If we have a group of songs by this artist, set them as a playlist
    if (artistFiles.length > 0) {
      const songIndex = artistFiles.findIndex(s => s.id === file.id);
      setCurrentPlaylist(artistFiles, songIndex >= 0 ? songIndex : 0);
    } else {
      // Just play the individual song
      playSong(file);
    }
  };
  
  const handleDeepScan = () => {
    setDialogOpen(false);
    deepScanMusicFiles();
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Welcome content when no songs are scanned
  if (!hasMusicFiles && !loading) {
    return (
      <div className="p-4 animate-in fade-in duration-500">
        <div className="text-center max-w-md mx-auto mb-10 mt-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to VibeFlow</h1>
          <p className="text-muted-foreground mb-8">Access and play music files directly from your device</p>
          
          <div className="flex flex-col gap-4 items-center">
            <Button 
              onClick={scanMusicFiles} 
              disabled={isScanning}
              className="bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all w-full max-w-[300px]"
            >
              <FileMusic className="mr-2 h-5 w-5" /> 
              {isScanning && !isDeepScan ? "Scanning..." : "Quick Scan for Music"}
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary"
                  disabled={isScanning}
                  className="px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all w-full max-w-[300px]"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" /> 
                  Scan Entire Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Deep Scan Warning
                  </DialogTitle>
                  <DialogDescription className="pt-2">
                    This will scan your entire device storage for audio files. The process may:
                    <ul className="list-disc pl-5 pt-2 space-y-1">
                      <li>Take a long time to complete</li>
                      <li>Use more battery power</li>
                      <li>Temporarily slow down your device</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-between">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeepScan}>
                    Start Deep Scan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {welcomeCards.map((card, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Music</h1>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                disabled={isScanning}
              >
                {isScanning && isDeepScan ? "Scanning..." : "Deep Scan"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Deep Scan Warning
                </DialogTitle>
                <DialogDescription className="pt-2">
                  This will scan your entire device storage for audio files. The process may:
                  <ul className="list-disc pl-5 pt-2 space-y-1">
                    <li>Take a long time to complete</li>
                    <li>Use more battery power</li>
                    <li>Temporarily slow down your device</li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-between">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDeepScan}>
                  Start Deep Scan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={scanMusicFiles}
            disabled={isScanning}
          >
            {isScanning && !isDeepScan ? "Scanning..." : "Quick Scan"}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      ) : hasMusicFiles ? (
        <div className="space-y-8">
          {/* All Songs Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">All Songs ({musicFiles.length})</h2>
            <div className="grid grid-cols-1 gap-2">
              {musicFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors cursor-pointer"
                  onClick={() => handlePlaySong(file, musicFiles)}
                >
                  <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden flex items-center justify-center">
                    <FileAudio className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{file.title || file.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{file.artist || 'Unknown Artist'}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {file.duration ? formatDuration(file.duration) : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Songs By Artist */}
          {Object.entries(artistGroups).map(([artist, files]) => (
            <section key={artist} className="mb-8">
              <h2 className="text-xl font-bold mb-4">{artist} ({files.length})</h2>
              <div className="grid grid-cols-1 gap-2">
                {files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors cursor-pointer"
                    onClick={() => handlePlaySong(file, files)}
                  >
                    <div className="h-12 w-12 rounded-md bg-primary/10 overflow-hidden flex items-center justify-center">
                      <FileAudio className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{file.title || file.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{file.artist || 'Unknown Artist'}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {file.duration ? formatDuration(file.duration) : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileMusic className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Music Files Found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any audio files on your device.<br />
            Try adding some MP3 files to your device or scan again.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={scanMusicFiles} disabled={isScanning}>
              {isScanning && !isDeepScan ? "Scanning..." : "Quick Scan"}
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setDialogOpen(true)}
              disabled={isScanning}
            >
              Deep Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
