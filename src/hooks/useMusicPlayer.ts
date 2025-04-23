
import { useState, useCallback, useRef, useEffect } from "react";
import { Howl } from "howler";

interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
  src?: string;
}

export const useMusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  
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

  // Function to play a song
  const playSong = useCallback((song: Song) => {
    if (!song.src) {
      console.error('No audio source provided for song:', song);
      return;
    }

    cleanupAudio();

    const sound = new Howl({
      src: [song.src],
      html5: true,
      volume: isMuted ? 0 : volume,
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
      onend: () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
        }
        if (repeatMode === 'one') {
          sound.play();
        } else if (repeatMode === 'all') {
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
    setCurrentSong(song);
    sound.play();
  }, [volume, isMuted, repeatMode]);

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
    // This would use the actual playlist in a real implementation
    console.log('Next song');
  }, []);

  // Function to go to previous song
  const prevSong = useCallback(() => {
    // This would use the actual playlist in a real implementation
    console.log('Previous song');
  }, []);

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

  return {
    currentSong,
    isPlaying,
    progress,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    playSong,
    togglePlay,
    nextSong,
    prevSong,
    seekTo,
    toggleShuffle,
    cycleRepeatMode,
    changeVolume,
    toggleMute,
    setProgress
  };
};

export default useMusicPlayer;
