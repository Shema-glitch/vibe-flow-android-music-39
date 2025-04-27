
import { useState, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions';

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
      const isAndroid = Capacitor.getPlatform() === 'android';
      
      if (isAndroid) {
        console.log("Android platform detected, requesting permissions");
        
        try {
          // Check permission status
          const storagePermission = await AndroidPermissions.checkPermission(
            AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
          );
          
          console.log("Storage permission status:", storagePermission);
          
          if (!storagePermission.hasPermission) {
            console.log("Requesting storage permission");
            
            // Request permission from user
            const permissionResult = await AndroidPermissions.requestPermission(
              AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
            );
            
            console.log("Permission request result:", permissionResult);
            
            if (!permissionResult.hasPermission) {
              toast({
                title: "Permission denied",
                description: "Storage permission is required to scan music files. Please enable it in your device settings.",
                variant: "destructive"
              });
              return false;
            }
          }
          
          // For Android 13+ (API 33+), also request READ_MEDIA_AUDIO permission
          try {
            const audioPermission = await AndroidPermissions.checkPermission(
              "android.permission.READ_MEDIA_AUDIO"
            );
            
            if (!audioPermission.hasPermission) {
              const audioPermResult = await AndroidPermissions.requestPermission(
                "android.permission.READ_MEDIA_AUDIO"
              );
              
              console.log("Audio media permission result:", audioPermResult);
            }
          } catch (err) {
            // This might fail on older Android versions, which is fine
            console.log("READ_MEDIA_AUDIO check failed, likely on older Android:", err);
          }
          
          return true;
        } catch (err) {
          console.error("Error with AndroidPermissions:", err);
          toast({
            title: "Plugin error",
            description: "Could not load the permissions plugin. Please restart the app and try again.",
            variant: "destructive"
          });
          return false;
        }
      } else {
        // When running in web browser, we'll simulate permission granted
        console.log("Running in web environment, simulating permission granted");
        return true;
      }
      
    } catch (error) {
      console.error("Error requesting permission:", error);
      toast({
        title: "Permission error",
        description: "Failed to request storage permission. Try restarting the app.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const scanMusicFiles = useCallback(async () => {
    console.log("Starting music file scan");
    const hasPermission = await requestStoragePermission();
    
    console.log("Permission status:", hasPermission);
    
    if (!hasPermission) {
      console.log("No permission, stopping scan");
      return;
    }

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
