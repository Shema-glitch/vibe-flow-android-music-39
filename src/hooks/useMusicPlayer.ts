
import { useState, useCallback } from "react";

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
  
  // Function to play a song
  const playSong = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  // Function to toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

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
    setVolume(value);
    if (isMuted && value > 0) setIsMuted(false);
  }, [isMuted]);

  // Function to toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

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
    toggleShuffle,
    cycleRepeatMode,
    changeVolume,
    toggleMute,
    setProgress
  };
};

export default useMusicPlayer;
