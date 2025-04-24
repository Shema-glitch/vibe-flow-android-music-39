
import { useState, useCallback } from 'react';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions';
import { toast } from "@/components/ui/use-toast";

export interface ScanProgress {
  totalFiles: number;
  scannedFiles: number;
  completedPercentage: number;
}

export interface MusicFile {
  id: string;
  path: string;
  name: string;
  title?: string;
  artist?: string;
  album?: string;
  duration?: number;
  albumArt?: string;
}

export function useFileSystem() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    totalFiles: 0,
    scannedFiles: 0,
    completedPercentage: 0
  });
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);

  const requestStoragePermission = useCallback(async () => {
    try {
      const { hasPermission } = await AndroidPermissions.checkPermission(
        AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      );

      if (!hasPermission) {
        const permissionResult = await AndroidPermissions.requestPermission(
          AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
        );
        
        if (!permissionResult.hasPermission) {
          toast({
            title: "Permission denied",
            description: "Storage permission is required to scan music files.",
            variant: "destructive"
          });
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Error requesting permission:", error);
      toast({
        title: "Permission error",
        description: "Failed to request storage permission.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const scanMusicFiles = useCallback(async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    setIsScanning(true);
    setScanProgress({
      totalFiles: 0,
      scannedFiles: 0,
      completedPercentage: 0
    });
    
    try {
      // Simulate scanning files
      // In a real implementation, you would use Capacitor File plugin or Cordova File plugin
      const totalFiles = 100; // Simulate 100 files to scan
      
      for (let i = 0; i <= totalFiles; i++) {
        if (i % 10 === 0) { // Update progress every 10 files
          setScanProgress({
            totalFiles,
            scannedFiles: i,
            completedPercentage: Math.floor((i / totalFiles) * 100)
          });
          
          // Pause to simulate processing time
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      // Simulate found music files with metadata
      const mockMusicFiles: MusicFile[] = Array.from({ length: 25 }, (_, i) => ({
        id: `song-${i + 1}`,
        path: `/storage/emulated/0/Music/song${i + 1}.mp3`,
        name: `song${i + 1}.mp3`,
        title: `Song Title ${i + 1}`,
        artist: i % 3 === 0 ? 'Artist A' : i % 3 === 1 ? 'Artist B' : 'Artist C',
        album: i % 5 === 0 ? 'Album X' : i % 5 === 1 ? 'Album Y' : i % 5 === 2 ? 'Album Z' : 'Greatest Hits',
        duration: 180 + i * 30, // Duration in seconds
      }));
      
      setMusicFiles(mockMusicFiles);
      
      // Complete the scan
      setScanProgress({
        totalFiles,
        scannedFiles: totalFiles,
        completedPercentage: 100
      });
      
      toast({
        title: "Scan completed",
        description: `Found ${mockMusicFiles.length} music files.`
      });
      
    } catch (error) {
      console.error("Error scanning files:", error);
      toast({
        title: "Scan failed",
        description: "An error occurred while scanning music files.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  }, [requestStoragePermission]);
  
  return {
    isScanning,
    scanProgress,
    musicFiles,
    scanMusicFiles,
    requestStoragePermission
  };
}
