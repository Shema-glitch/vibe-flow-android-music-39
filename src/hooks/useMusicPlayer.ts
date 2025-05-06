import { useState, useCallback, useRef, useEffect } from "react";
import { Howl } from "howler";
import { fetchLyrics } from "@/services/lyricsService";
import { toast } from "@/components/ui/use-toast";
import { MusicFile } from "./useFileSystem";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  duration?: number;
  src: string;
}

export const useMusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<number | null>(null);

  // Clean up previous audio when changing songs
  const cleanupAudio = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }
  }, []);

  // Function to fetch lyrics
  const getLyrics = useCallback(async (song: Song) => {
    if (!song.title || !song.artist) return;
    
    setLoadingLyrics(true);
    setLyrics(null);
    
    try {
      const songLyrics = await fetchLyrics({
        title: song.title,
        artist: song.artist
      });
      
      setLyrics(songLyrics);
      
      if (!songLyrics) {
        console.log(`No lyrics found for ${song.title} by ${song.artist}`);
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      toast({
        title: "Error",
        description: "Failed to load lyrics",
        variant: "destructive"
      });
    } finally {
      setLoadingLyrics(false);
    }
  }, []);

  // Function to play a song
  const playSong = useCallback((song: Song | MusicFile) => {
    cleanupAudio();

    // If song is a MusicFile, convert it to Song format
    const songToPlay: Song = 'uri' in song 
      ? {
          id: song.id,
          title: song.title || song.name || 'Unknown Title',
          artist: song.artist || 'Unknown Artist',
          albumArt: song.albumArt || '/placeholder.svg',
          duration: song.duration,
          src: song.uri || ''
        }
      : song as Song;
    
    if (!songToPlay.src) {
      console.error('No audio source provided for song:', songToPlay);
      toast({
        title: "Playback Error",
        description: "This song doesn't have a valid audio source",
        variant: "destructive"
      });
      return;
    }

    console.log("Playing song:", songToPlay);
    
    try {
      const sound = new Howl({
        src: [songToPlay.src],
        html5: true,
        volume: isMuted ? 0 : volume,
        format: ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac'],
        onplay: () => {
          setIsPlaying(true);
          // Update progress every second
          progressInterval.current = window.setInterval(() => {
            if (sound.playing()) {
              const progress = (sound.seek() / sound.duration()) * 100;
              setProgress(progress);
            }
          }, 1000);
        },
        onload: () => {
          console.log("Song loaded successfully:", songToPlay.title);
        },
        onloaderror: (id, error) => {
          console.error("Error loading song:", error);
          toast({
            title: "Playback Error",
            description: "Failed to load the audio file",
            variant: "destructive"
          });
        },
        onplayerror: (id, error) => {
          console.error("Error playing song:", error);
          toast({
            title: "Playback Error",
            description: "Failed to play the audio file",
            variant: "destructive"
          });
        },
        onend: () => {
          setIsPlaying(false);
          setProgress(0);
          if (progressInterval.current) {
            window.clearInterval(progressInterval.current);
          }
          if (repeatMode === 'one') {
            sound.play();
          } else if (repeatMode === 'all' || playlist.length > 0) {
            nextSong();
          }
        },
        onstop: () => {
          setIsPlaying(false);
          if (progressInterval.current) {
            window.clearInterval(progressInterval.current);
          }
        },
        onpause: () => {
          setIsPlaying(false);
        },
      });

      soundRef.current = sound;
      setCurrentSong(songToPlay);
      sound.play();
      
      // Find the song in the playlist if it exists
      if (playlist.length > 0) {
        const index = playlist.findIndex(s => s.id === songToPlay.id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
      
      // Fetch lyrics when playing a song
      getLyrics(songToPlay);
    } catch (error) {
      console.error("Error initializing playback:", error);
      toast({
        title: "Playback Error",
        description: "An error occurred while trying to play the song",
        variant: "destructive"
      });
    }
  }, [volume, isMuted, repeatMode, cleanupAudio, getLyrics, playlist]);

  // Set the current playlist
  const setCurrentPlaylist = useCallback((songs: Song[] | MusicFile[], startIndex = 0) => {
    // Convert any MusicFile objects to Song format
    const formattedPlaylist: Song[] = songs.map(song => {
      if ('uri' in song) {
        return {
          id: song.id,
          title: song.title || song.name || 'Unknown Title',
          artist: song.artist || 'Unknown Artist',
          albumArt: song.albumArt || '/placeholder.svg',
          duration: song.duration,
          src: song.uri || ''
        };
      }
      return song as Song;
    });
    
    setPlaylist(formattedPlaylist);
    setCurrentIndex(startIndex);
    
    // If we have valid songs, play the one at startIndex
    if (formattedPlaylist.length > 0 && startIndex < formattedPlaylist.length) {
      playSong(formattedPlaylist[startIndex]);
    }
  }, [playSong]);

  // Function to toggle play/pause
  const togglePlay = useCallback(() => {
    if (!soundRef.current) return;
    
    if (soundRef.current.playing()) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Function to skip to next song
  const nextSong = useCallback(() => {
    if (playlist.length <= 1) return;
    
    let nextIndex = currentIndex + 1;
    
    // If shuffle is on, pick a random song
    if (isShuffled) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentIndex && playlist.length > 1);
      nextIndex = randomIndex;
    } 
    // Otherwise use the next song in the playlist
    else if (nextIndex >= playlist.length) {
      nextIndex = 0; // Loop back to the beginning
    }
    
    setCurrentIndex(nextIndex);
    playSong(playlist[nextIndex]);
  }, [currentIndex, isShuffled, playlist, playSong]);

  // Function to go to previous song
  const prevSong = useCallback(() => {
    if (playlist.length <= 1) return;
    
    // If we're more than 3 seconds into the song, restart it
    if (soundRef.current && soundRef.current.seek() > 3) {
      soundRef.current.seek(0);
      return;
    }
    
    let prevIndex = currentIndex - 1;
    
    // If shuffle is on, pick a random song
    if (isShuffled) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * playlist.length);
      } while (randomIndex === currentIndex && playlist.length > 1);
      prevIndex = randomIndex;
    } 
    // Otherwise use the previous song in the playlist
    else if (prevIndex < 0) {
      prevIndex = playlist.length - 1; // Loop back to the end
    }
    
    setCurrentIndex(prevIndex);
    playSong(playlist[prevIndex]);
  }, [currentIndex, isShuffled, playlist, playSong]);

  // Function to seek to a specific position
  const seekTo = useCallback((percentage: number) => {
    if (!soundRef.current) return;
    
    const duration = soundRef.current.duration();
    const position = (percentage / 100) * duration;
    soundRef.current.seek(position);
    setProgress(percentage);
  }, []);

  // Function to toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  // Function to cycle through repeat modes
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  }, []);

  // Function to change volume
  const changeVolume = useCallback((value: number) => {
    if (soundRef.current) {
      soundRef.current.volume(value);
    }
    setVolume(value);
    if (isMuted && value > 0) setIsMuted(false);
  }, [isMuted]);

  // Function to toggle mute
  const toggleMute = useCallback(() => {
    if (!soundRef.current) return;
    
    const newMutedState = !isMuted;
    soundRef.current.volume(newMutedState ? 0 : volume);
    setIsMuted(newMutedState);
  }, [isMuted, volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Format duration from seconds to mm:ss
  const formatDuration = useCallback((seconds?: number): string => {
    if (!seconds) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get current position in mm:ss
  const getCurrentPosition = useCallback((): string => {
    if (!soundRef.current) return "0:00";
    const seconds = soundRef.current.seek();
    return formatDuration(typeof seconds === 'number' ? seconds : 0);
  }, [formatDuration]);

  // Get total duration in mm:ss
  const getTotalDuration = useCallback((): string => {
    if (!soundRef.current) return "0:00";
    return formatDuration(soundRef.current.duration());
  }, [formatDuration]);

  return {
    currentSong,
    isPlaying,
    progress,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    lyrics,
    loadingLyrics,
    playlist,
    currentIndex,
    playSong,
    setCurrentPlaylist,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
    changeVolume,
    toggleMute,
    getLyrics,
    formatDuration,
    getCurrentPosition,
    getTotalDuration
  };
};

export default useMusicPlayer;
